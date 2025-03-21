import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

interface AttendanceRecord {
  name: string;
  year: number;
  email: string;
  eventDate: Date;
  quarter: string;
  isCampusGroups: boolean;
}

const academicYearCalendar: Record<number, {
  fall: [Date, Date],
  winter: [Date, Date],
  spring: [Date, Date],
}> = {
  2024: { // 2024-2025 Academic Year
    fall: [new Date(2024, 7, 21), new Date(2024, 10, 25)],
    winter: [new Date(2024, 11, 2), new Date(2025, 2, 3)],
    spring: [new Date(2025, 2, 10), new Date(2025, 5, 3)],
  },
};

function getQuarter(date: Date): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const previousYear = currentYear - 1;

  const relevantYears = [currentYear, previousYear];

  for (const year of relevantYears) {
    const calendar = academicYearCalendar[year];
    if (calendar) {
      if (date >= calendar.fall[0] && date <= calendar.fall[1]) {
        return `${year}Q1`; // Fall Quarter
      }
      if (date >= calendar.winter[0] && date <= calendar.winter[1]) {
        return `${year}Q2`; // Winter Quarter
      }
      if (date >= calendar.spring[0] && date <= calendar.spring[1]) {
        return `${year}Q3`; // Spring Quarter
      }
    }
  }
  throw new Error(`Date ${date} does not fall within any relevant academic quarter`);
}

export async function GET() {
  try {
    const eventsDir = path.join(process.cwd(), 'public/events');
    const files = fs.readdirSync(eventsDir).filter(file => file.endsWith('.csv'));

    if (files.length === 0) {
      return NextResponse.json({ message: "No CSV files found" }, { status: 404 });
    }

    const attendanceRecords: AttendanceRecord[] = [];
    const uniqueRows = new Set<string>();

    for (const file of files) {
      const filePath = path.join(eventsDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      const parsed = Papa.parse(fileContents, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim()
      });
      for (const row of parsed.data as { [key: string]: string }[]) {
        const rowString = JSON.stringify(row);
        if (uniqueRows.has(rowString)) {
          continue; // Skip duplicate rows
        }
        uniqueRows.add(rowString);

        try {
          const eventDate = new Date(row["Checked-In Date"]);
          if (isNaN(eventDate.getTime())) {
            throw new Error(`Invalid date: ${row["Checked-In Date"]}`);
          }
          const quarter = getQuarter(eventDate);
          attendanceRecords.push({
            name: `${row["First Name"]} ${row["Last Name"]}`,
            year: parseInt(row["Year of Graduation"], 10),
            email: row["Email"],
            eventDate,
            quarter,
            isCampusGroups: row["Is Member"] === "Yes",
          });
        } catch (error) {
          console.error('Error parsing row:', error);
        }
      }
    }

    // group
    const userAttendanceMap: Record<
      string,
      { name: string; year: number; email: string; events: Date[]; quarters: Record<string, number>; isCampusGroups?: boolean }
    > = {};

    for (const record of attendanceRecords) {
      const key = record.email;
      if (!userAttendanceMap[key]) {
        userAttendanceMap[key] = {
          name: record.name,
          year: record.year,
          email: record.email,
          events: [],
          quarters: {},
          isCampusGroups: record.isCampusGroups
        };
      }
      userAttendanceMap[key].events.push(record.eventDate);
      if (!userAttendanceMap[key].quarters[record.quarter]) {
        userAttendanceMap[key].quarters[record.quarter] = 0;
      }
      userAttendanceMap[key].quarters[record.quarter]++;
    }

    const academicQuarters = Array.from(new Set(attendanceRecords.map(r => r.quarter)));
    academicQuarters.sort();
    const lastQuarter = '2024Q2'; // TODO: manually set this until i figure out how to get the last quarter to change

    const activeMembers = Object.values(userAttendanceMap)
      .map(user => ({
        name: user.name,
        year: user.year,
        email: user.email,
        events: user.events,
        quarters: user.quarters,
        isActive: (user.quarters[lastQuarter] || 0) >= 4,
        isCampusGroups: user.isCampusGroups,
      }));

    return NextResponse.json({ members: activeMembers }, { status: 200 });
  } catch (error) {
    console.error("Error processing CSV files:", error);
    return NextResponse.json({ error: "Failed to read CSV files" }, { status: 500 });
  }
}

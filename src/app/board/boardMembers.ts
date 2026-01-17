import {BOARD_IMAGES} from "@/app/lib/images";

export interface BoardMember {
    id: string;
    name: string;
    role: string;
    major?: string;
    year?: string;
    minors?: string;
    image?: string;
    focus?: { x: number; y: number };
    bio?: string;
    interests?: string[];
    hobbies?: string[];
    previousRoles?: string[];
    whySASE?: string;
    hometown?: string;
    links?: {
        linkedin?: string;
        github?: string;
        email?: string;
        portfolio?: string;
    };
}

export const boardMembers: BoardMember[] = [
    {
        id: "president",
        name: "Keira",
        role: "President",
        major: "Chemical Engineering",
        year: "Junior",
        minors: "Chemistry (Organic) • Concurrent MS in Engineering Management",
        bio: "Keira is a junior chemical engineering major who is pursuing a concurrent masters degree in engineering management as well as a minor in chemistry (organic). Her interests lie in R&D and engineering opportunities, and her hobbies include archery, reading, and baking. She has served on the SASE executive board for 3 years now as the former Freshman Representative, former Internal Vice President, and now is currently serving as the President.",
        interests: ["R&D", "Engineering"],
        hobbies: ["Archery", "Reading", "Baking"],
        previousRoles: ["Freshman Representative", "Internal Vice President"],
        whySASE: "What draws her to SASE is the vibrant community and opportunities to give back and create a welcoming space for all students via events that honor SASE RHIT's Asian community's collective heritages."
    },
    {
        id: "internal-vp",
        name: "Niko",
        role: "Internal Vice President",
        major: "Mechanical Engineering",
        year: "Junior",
        minors: "Robotics",
        bio: "Niko is a junior mechanical engineering student minoring in robotics, driven by work at the intersection of mechanical design and dynamic systems. Outside the classroom, you can probably find him walking, lifting, reading, or playing guitar. Formerly the Philanthropy Chair, he now serves as Internal Vice President.",
        interests: ["Mechanical Design", "Dynamic Systems"],
        hobbies: ["Walking", "Lifting", "Reading", "Playing Guitar"],
        previousRoles: ["Philanthropy Chair"],
        whySASE: "Drawing him to SASE is the desire to support and give back to a community that helped him grow."
    },
    {
        id: "external-vp",
        name: "Jonathan",
        role: "External Vice President",
        major: "Mechanical Engineering",
        year: "Sophomore",
        minors: "Concurrent MS in Engineering Management",
        image: BOARD_IMAGES.externalVP,
        focus: {x: 0.5, y: 0.3},
        bio: "Jonathan is a sophomore mechanical engineer major also working towards his master's in engineering management. When he's not solving problem sets, you'll find him playing pickleball, making tea, or dabbling on the piano. Ever since serving as the former Freshman Representative and now External Vice President, SASE has always been a place where he can relax, have fun, and connect with people outside of the classroom!",
        hobbies: ["Pickleball", "Making Tea", "Piano"],
        previousRoles: ["Freshman Representative"],
        whySASE: "He loves SASE for its casual, welcoming atmosphere. SASE has always been a place where he can relax, have fun, and connect with people outside of the classroom!"
    },
    {
        id: "treasurer",
        name: "David",
        role: "Treasurer",
    },
    {
        id: "secretary",
        name: "PJ",
        role: "Secretary",
    },
    {
        id: "event-coordinator",
        name: "Sandya",
        role: "Event Coordinator",
        major: "Computer Science",
        year: "Junior",
        hometown: "Santa Clara, California",
        image: BOARD_IMAGES.eventCoordinator,
        focus: {x: 0.5, y: 0.4},
        bio: "Sandya is a junior Computer Science major from Santa Clara, California with interests in robotics, embedded engineering, and origami-based research. She serves on the CSSE advisory board and helps organize events for the department's mentoring program. Outside academics, she enjoys dance and fiber arts. Drawn to cultural communities at Rose through her background in Japanese Club and Japan Bowl, she first joined SASE as cultural chair in her freshman spring and later became an event coordinator.",
        interests: ["Robotics", "Embedded Engineering", "Origami-based Research"],
        hobbies: ["Dance", "Fiber Arts"],
        previousRoles: ["Cultural Chair"],
        whySASE: "She is passionate about promoting cultural representation, raising awareness on campus, and hosting engaging events for the Rose community."
    },
    {
        id: "marketing-chair",
        name: "Avery",
        role: "Marketing Chair",
    },
    {
        id: "freshman-rep",
        name: "Micaiah",
        role: "Freshman Representative",
        year: "Freshman",
    },
    {
        id: "web-developer",
        name: "Chris",
        role: "Web Developer",
        major: "Software Engineering",
        minors: "Japanese",
        year: "Senior",
        hometown: "Denver, Colorado",
        image: BOARD_IMAGES.webDeveloper,
        interests: ["Full Stack Software Engineering"],
        bio: "Chris is the creator and current maintainer of this website. He is a long time board member of SASE@RHIT, and has extensive experience with Full Stack Software Engineering. His hobbies include running, hiking and writing.",
        links: {
            linkedin: "https://www.linkedin.com/in/chrislardner/",
            github: "https://www.github.com/chrislardner/",
        }
    }
];

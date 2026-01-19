import {requireFinanceAccess} from '@/lib/auth/finance-auth';
import FinancePageClient from './FinancePageClient';


export default async function FinancePage() {
    const authResult = await requireFinanceAccess();
    return <FinancePageClient userEmail={authResult.email}/>;
}
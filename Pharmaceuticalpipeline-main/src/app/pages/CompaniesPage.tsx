import { Link } from 'react-router';
import { Building2, ExternalLink, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppData } from '../data/AppDataContext';

export function CompaniesPage() {
  const { companies, getProductsByCompany, loading, error } = useAppData();
  const companiesWithStats = companies.map((company) => {
    const companyProducts = getProductsByCompany(company.id);
    const activeProducts = companyProducts.filter((p) => p.status === 'Active').length;
    const approvedProducts = companyProducts.filter((p) => p.status === 'Approved').length;

    return {
      ...company,
      totalProducts: companyProducts.length,
      activeProducts,
      approvedProducts,
    };
  }).sort((a, b) => b.totalProducts - a.totalProducts);

  if (loading) {
    return <PageState description="Loading companies from the local backend..." />;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">Companies</h1>
          <p className="text-slate-600">
            Browse pharmaceutical companies and their product pipelines
          </p>
        </div>

        {error && <BackendNotice message={error} />}

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Headquarters</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead className="text-right">Total Products</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                  <TableHead className="text-right">Approved</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companiesWithStats.map((company) => (
                  <TableRow key={company.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Building2 className="size-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-slate-500">
                            {company.employeeCount} employees
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.headquarters}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-4 text-green-600" />
                        <span>{company.marketCap || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {company.totalProducts}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                        {company.activeProducts}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                        {company.approvedProducts}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/companies/${company.id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View
                        <ExternalLink className="size-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BackendNotice({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {message}
    </div>
  );
}

function PageState({ description }: { description: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Companies</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

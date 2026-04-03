import { DevelopmentPhase } from '../../types/database';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Building2, MapPin, Users, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAppData } from '../data/AppDataContext';
import { getPhaseColor, getPhaseTextColor } from '../data/catalog';

const BRAND_BAR_COLOR = '#6db5b5';

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { getCompanyById, getProductsByCompany, getIndicationById, loading, error } = useAppData();
  const company = companyId ? getCompanyById(companyId) : undefined;
  const products = companyId ? getProductsByCompany(companyId) : [];

  if (loading) {
    return <PageState description="Loading company data from the local backend..." />;
  }

  if (!company) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Company not found</h2>
          <Link to="/companies" className="text-blue-600 hover:underline">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const activeProducts = products.filter((p) => p.status === 'Active').length;
  const approvedProducts = products.filter((p) => p.status === 'Approved').length;

  // Products by phase
  const productsByPhase = products.reduce((acc, product) => {
    const phase = product.currentPhase;
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const phaseData = Object.entries(productsByPhase).map(([phase, count]) => ({
    name: phase,
    value: count,
    color: getPhaseColor(phase as DevelopmentPhase),
  }));

  // Products by therapy area
  const productsByTherapyArea = products.reduce((acc, product) => {
    const indication = getIndicationById(product.indicationId);
    const area = indication?.therapyArea || 'Unknown';
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const therapyAreaData = Object.entries(productsByTherapyArea)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8">
        {/* Back Button */}
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to Companies
        </Link>

        {error && <BackendNotice message={error} />}

        {/* Company Header */}
        <div className="flex items-start gap-6">
          <div className="size-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Building2 className="size-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-2">{company.name}</h1>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                {company.headquarters}
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                {company.employeeCount} employees
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4" />
                {company.marketCap || 'N/A'} market cap
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Total Products</p>
              <p className="text-3xl font-semibold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Active Programs</p>
              <p className="text-3xl font-semibold">{activeProducts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Approved Products</p>
              <p className="text-3xl font-semibold">{approvedProducts}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pipeline by Phase */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline by Phase</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={phaseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={100}
                    fill={phaseData[0]?.color ?? BRAND_BAR_COLOR}
                    dataKey="value"
                  >
                    {phaseData.map((entry) => (
                      <Cell key={`company-phase-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline by Therapy Area */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline by Therapy Area</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={therapyAreaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={BRAND_BAR_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Indication</TableHead>
                  <TableHead>Therapy Area</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Current Phase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const indication = getIndicationById(product.indicationId);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{indication?.name}</TableCell>
                      <TableCell>{indication?.therapyArea}</TableCell>
                      <TableCell>{product.modality || 'Unclassified'}</TableCell>
                      <TableCell>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getPhaseColor(product.currentPhase),
                            color: getPhaseTextColor(product.currentPhase),
                          }}
                        >
                          {product.currentPhase}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'Active'
                              ? 'bg-blue-50 text-blue-700'
                              : product.status === 'Approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(product.lastUpdated || product.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        <h1 className="text-2xl font-semibold mb-2">Company</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

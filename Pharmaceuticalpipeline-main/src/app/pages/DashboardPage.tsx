import { DevelopmentPhase } from '../../types/database';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppData } from '../data/AppDataContext';
import { getPhaseColor, getPhaseTextColor } from '../data/catalog';
import { Activity, Beaker, Building2, CheckCircle2 } from 'lucide-react';

const BRAND_BAR_COLOR = '#6db5b5';

export function DashboardPage() {
  const { products, companies, getIndicationById, loading, error } = useAppData();

  if (loading) {
    return <PageState description="Loading dashboard data from the local backend..." />;
  }

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const approvedProducts = products.filter(p => p.status === 'Approved').length;
  const totalCompanies = companies.length;

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
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Recent updates
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.lastUpdated || b.startDate).getTime() - new Date(a.lastUpdated || a.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Overview of pharmaceutical product pipelines across all companies
          </p>
        </div>

        {error && <BackendNotice message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Beaker className="size-5" />}
            color="blue"
          />
          <StatCard
            title="Active Programs"
            value={activeProducts}
            icon={<Activity className="size-5" />}
            color="purple"
          />
          <StatCard
            title="Approved"
            value={approvedProducts}
            icon={<CheckCircle2 className="size-5" />}
            color="green"
          />
          <StatCard
            title="Companies Tracked"
            value={totalCompanies}
            icon={<Building2 className="size-5" />}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pipeline by Phase */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Distribution by Phase</CardTitle>
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
                      <Cell key={`phase-${entry.name}`} fill={entry.color} />
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

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => {
                const indication = getIndicationById(product.indicationId);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium mb-1">{product.name}</div>
                      <div className="text-sm text-slate-600">
                        {indication?.name} • {indication?.therapyArea}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getPhaseColor(product.currentPhase),
                          color: getPhaseTextColor(product.currentPhase),
                        }}
                      >
                        {product.currentPhase}
                      </div>
                      <div className="text-sm text-slate-500 w-24 text-right">
                        {new Date(product.lastUpdated || product.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
          </div>
          <div className={`size-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, FileText, DollarSign, Zap, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { tokenUsageApi } from '../lib/api';

export default function TokenUsagePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadStats();
  }, [dateRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await tokenUsageApi.getStats(dateRange);
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading token usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('pt-BR').format(num);
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Uso de Tokens</h2>
          <p className="text-muted-foreground mt-1">Monitore o consumo de tokens e custos em tempo real</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="px-4 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="all">Todo período</option>
        </select>
      </div>

      {!stats && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total de Tokens</CardDescription>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(stats?.totalTokens || 0)}</div>
                <p className="text-xs text-muted-foreground mt-2">Tokens consumidos</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Custo Total</CardDescription>
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(stats?.totalCost || 0)}</div>
                <p className="text-xs text-muted-foreground mt-2">Custo estimado</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Documentos</CardDescription>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatNumber(stats?.totalDocuments || 0)}</div>
                <p className="text-xs text-muted-foreground mt-2">Processados</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Usuários Ativos</CardDescription>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground mt-2">Com atividade</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats?.byUser && stats.byUser.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Uso por Usuário
                  </CardTitle>
                  <CardDescription>Top usuários por consumo de tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.byUser.map((user: any, index: number) => (
                      <div key={user.user_id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{formatNumber(user.tokens_used)}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(user.cost)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {stats?.byAnalysisType && stats.byAnalysisType.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    Uso por Tipo de Análise
                  </CardTitle>
                  <CardDescription>Distribuição por categoria de análise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.byAnalysisType.map((type: any) => (
                      <div key={type.analysis_type_id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-xs text-muted-foreground">{type.usage_count} análises realizadas</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-secondary">{formatNumber(type.tokens_used)}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(type.cost)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

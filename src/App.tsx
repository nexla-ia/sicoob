import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/toast';
import LoginPage from './pages/LoginPage';
import AnalysisPage from './pages/AnalysisPage';
import AnalysisTypesPage from './pages/AnalysisTypesPage';
import UsersPage from './pages/UsersPage';
import TokenUsagePage from './pages/TokenUsagePage';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Upload } from 'lucide-react';

type PageType = 'analysis' | 'analysis-types' | 'users' | 'token-usage';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('analysis');
  const [showLoginOrApp, setShowLoginOrApp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!showLoginOrApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Sistema de Análise de Documentos
            </h1>
            <p className="text-xl text-slate-600">
              Upload direto de arquivos ou acesse o sistema completo
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setCurrentPage('analysis')}
              size="lg"
              className="w-full text-lg py-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Upload className="w-6 h-6 mr-3" />
              Fazer Upload de Documento
            </Button>

            <Button
              onClick={() => setShowLoginOrApp(true)}
              size="lg"
              variant="outline"
              className="w-full text-lg py-8 border-2"
            >
              Acessar Sistema Completo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginPage />;
  }

  const handleNavigate = (page: PageType) => {
    const allowedPages = profile?.role === 'admin'
      ? ['analysis', 'token-usage', 'analysis-types', 'users']
      : ['analysis'];

    if (!allowedPages.includes(page)) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'token-usage' && profile.role === 'admin' && <TokenUsagePage />}
      {currentPage === 'analysis' && <AnalysisPage />}
      {currentPage === 'analysis-types' && profile.role === 'admin' && <AnalysisTypesPage />}
      {currentPage === 'users' && profile.role === 'admin' && <UsersPage />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, PenLine, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { analysisTypesApi } from '../lib/api';

export default function AnalysisPage() {
  const { profile } = useAuth();
  const [analysisTypes, setAnalysisTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loadingTypes, setLoadingTypes] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAnalysisTypes();
  }, []);

  const loadAnalysisTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await analysisTypesApi.getAll(true);
      if (response.data) {
        setAnalysisTypes(response.data);
      }
    } catch (error) {
      console.error('Error loading analysis types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(10);
  const [statusMessage, setStatusMessage] = useState('Preparando envio...');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [documentResults, setDocumentResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (!analyzing) return;

    const progressSteps = [
      { progress: 10, message: `Preparando envio de ${files.length} documento(s)...` },
      { progress: 25, message: `Analisando documento(s) com IA...` },
      { progress: 40, message: 'Extraindo informações...' },
      { progress: 55, message: 'Processando dados...' },
      { progress: 70, message: 'Gerando análise detalhada...' },
      { progress: 85, message: 'Finalizando análise...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep].progress);
        setStatusMessage(progressSteps[currentStep].message);
        currentStep++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [analyzing]);

  const handleSubmit = async () => {
    if (!selectedType || files.length === 0) {
      alert('Selecione um tipo de análise e arquivo');
      return;
    }

    setAnalyzing(true);
    setProgress(10);
    setStatusMessage(`Preparando envio de ${files.length} documento(s)...`);

    try {
      const results: any[] = [];

      const selectedAnalysis  = analysisTypes.find(t => t.id === selectedType);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(30 + (i * 50 / files.length));
        setStatusMessage(`Analisando documento ${i + 1} de ${files.length}...`);

        const base64 = await fileToBase64(file);

        setProgress(50 + (i * 50 / files.length));
        setStatusMessage(`Enviando documento ${i + 1} para análise...`);

        const response = await fetch('https://n8n.nexladesenvolvimento.com.br/webhook/sicoob', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: profile?.id,
            userName: profile?.full_name,
            userEmail: profile?.email,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            analysisType: selectedType,
            analysisName: selectedAnalysis?.name,
            aiModel: selectedAnalysis?.aiModel,
            template: selectedAnalysis?.template,
            documentBase64: base64,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro na resposta do servidor: ${response.status} ${response.statusText}`);
        }

        setProgress(80 + (i * 20 / files.length));
        setStatusMessage(`Processando documento ${i + 1}...`);

        const contentType = response.headers.get('content-type');
        let result: any;

        if (contentType?.includes('application/json')) {
          result = await response.json();
        } else {
          const text = await response.text();
          result = { output: text };
        }

        if (!result || (!result.output && !result.data && typeof result !== 'string')) {
          throw new Error('Resposta vazia do servidor');
        }

        results.push({ ...result, fileName: file.name });
      }

      setProgress(100);
      setStatusMessage('Todos os documentos foram analisados com sucesso!');

      setTimeout(() => {
        setAnalyzing(false);
        setDocumentResults(results);
        setAnalysisResult(results[0]);
        setSelectedDocIndex(0);
      }, 1000);
    } catch (error: any) {
      console.error('Error uploading:', error);
      setAnalyzing(false);
      const errorMessage = error.message || 'Erro ao enviar documento';
      alert(`Erro: ${errorMessage}`);
    }
  };

  if (analyzing) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center">
        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Decorative Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8 max-w-2xl px-6">
          {/* Animated Icon */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 rounded-full blur-2xl opacity-75 animate-pulse"></div>

            {/* Middle Layer */}
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-green-500 shadow-2xl animate-pulse flex items-center justify-center">
              {/* Inner Content */}
              <div className="w-24 h-24 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                <PenLine className="w-16 h-16 text-cyan-500 animate-bounce" style={{ animationDuration: '1s' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
              {statusMessage}
            </h2>
            <p className="text-lg font-medium text-slate-600 mt-2">
              Isso pode levar alguns segundos...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-2">
            <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-slate-600 text-center">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    const outputText = analysisResult.output || analysisResult;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Resultado da Análise
            </h2>
            <p className="text-muted-foreground mt-1">Análise concluída com sucesso</p>
          </div>
          <Button onClick={() => {
            setAnalysisResult(null);
            setDocumentResults([]);
            setFiles([]);
            setSelectedType('');
            setSelectedDocIndex(0);
          }}>
            Nova Análise
          </Button>
        </div>

        {documentResults.length > 1 && (
          <div className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-xl p-4 shadow-md">
            <span className="text-sm font-semibold text-slate-700">Selecione o documento:</span>
            <div className="flex gap-2">
              {documentResults.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDocIndex(idx);
                    setAnalysisResult(documentResults[idx]);
                  }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                    selectedDocIndex === idx
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                      : 'bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:scale-105'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <span className="text-sm text-slate-600 ml-2">
              {documentResults[selectedDocIndex]?.fileName || `Documento ${selectedDocIndex + 1}`}
            </span>
          </div>
        )}

{(() => {
          const sections: { title: string; content: string[] }[] = [];
          let currentSection: { title: string; content: string[] } | null = null;

          const lines = outputText.split('\n');

          lines.forEach((line: string) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('## ')) {
              if (currentSection && currentSection.content.length > 0) {
                sections.push(currentSection);
              }
              currentSection = { title: trimmedLine.replace('## ', ''), content: [] };
            } else if (trimmedLine.startsWith('- ')) {
              if (currentSection) {
                currentSection.content.push(trimmedLine.replace('- ', ''));
              } else {
                if (!sections.length || sections[sections.length - 1].title !== 'INFORMAÇÕES GERAIS') {
                  sections.push({ title: 'INFORMAÇÕES GERAIS', content: [trimmedLine.replace('- ', '')] });
                } else {
                  sections[sections.length - 1].content.push(trimmedLine.replace('- ', ''));
                }
              }
            } else if (trimmedLine && !trimmedLine.startsWith('#')) {
              if (currentSection) {
                currentSection.content.push(trimmedLine);
              }
            }
          });

          if (currentSection && currentSection.content.length > 0) {
            sections.push(currentSection);
          }

          const exportToPDF = () => {
            try {
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
              });

              const pageWidth = 210;
              const pageHeight = 297;
              const margin = 15;
              const contentWidth = pageWidth - (margin * 2);
              let yPosition = margin;

              const fileName = documentResults[selectedDocIndex]?.fileName || 'documento';

              pdf.setFontSize(18);
              pdf.setFont('helvetica', 'bold');
              pdf.text('Análise de Documento', margin, yPosition);
              yPosition += 8;

              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.text(fileName, margin, yPosition);
              yPosition += 10;

              sections.forEach((section, sectionIdx) => {
                if (yPosition > pageHeight - 40) {
                  pdf.addPage();
                  yPosition = margin;
                }

                pdf.setFillColor(37, 99, 235);
                pdf.rect(margin, yPosition, contentWidth, 12, 'F');

                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text(section.title, margin + 3, yPosition + 8);

                yPosition += 15;
                pdf.setTextColor(0, 0, 0);

                section.content.forEach((item, itemIdx) => {
                  const processedText = item.replace(/\*\*(.*?)\*\*/g, '$1');

                  const lines = pdf.splitTextToSize(`• ${processedText}`, contentWidth - 10);
                  const lineHeight = 6;
                  const blockHeight = lines.length * lineHeight + 4;

                  if (yPosition + blockHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                  }

                  pdf.setFillColor(240, 247, 255);
                  pdf.rect(margin + 5, yPosition - 2, contentWidth - 10, blockHeight, 'F');

                  pdf.setDrawColor(191, 219, 254);
                  pdf.rect(margin + 5, yPosition - 2, contentWidth - 10, blockHeight, 'S');

                  pdf.setFontSize(10);

                  let textY = yPosition + 3;
                  lines.forEach(line => {
                    const hasBold = item.match(/\*\*(.*?)\*\*/);
                    if (hasBold) {
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      let xOffset = margin + 8;

                      parts.forEach((part, idx) => {
                        if (idx % 2 === 1) {
                          pdf.setFont('helvetica', 'bold');
                        } else {
                          pdf.setFont('helvetica', 'normal');
                        }
                        pdf.text(part, xOffset, textY);
                        xOffset += pdf.getTextWidth(part);
                      });
                    } else {
                      pdf.setFont('helvetica', 'normal');
                      pdf.text(line, margin + 8, textY);
                    }
                    textY += lineHeight;
                  });

                  yPosition += blockHeight + 3;
                });

                yPosition += 5;
              });

              pdf.save(`analise-${fileName}.pdf`);
            } catch (error) {
              console.error('Erro ao gerar PDF:', error);
            }
          };

          return sections.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={exportToPDF}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
              <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, idx) => {
                const itemCount = section.content.length;
                const isSingleItem = itemCount === 1;
                return (
                  <Card
                    key={idx}
                    className={`group bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-blue-300 hover:border-blue-500 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden ${isSingleItem ? 'md:col-span-1' : ''}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <CardTitle className="text-xl font-extrabold tracking-wide flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={isSingleItem ? 'pt-4 pb-4' : 'pt-6'}>
                      <div className={isSingleItem ? 'space-y-2' : 'space-y-3'}>
                        {section.content.map((item, i) => {
                          const parts = item.split(/(\*\*.*?\*\*)/g);
                          return (
                            <div
                              key={i}
                              className={`flex items-start gap-3 rounded-lg bg-white/60 hover:bg-white border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-md ${isSingleItem ? 'p-2.5' : 'p-3'}`}
                            >
                              <span className="text-blue-600 text-xl font-bold mt-0.5 flex-shrink-0">•</span>
                              <p className="text-base text-slate-800 leading-relaxed flex-1 font-medium">
                                {parts.map((part, idx) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                      <strong key={idx} className="font-extrabold text-slate-900">
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return <span key={idx}>{part}</span>;
                                })}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Dados Extraídos pela IA</CardTitle>
                <CardDescription>Informações identificadas no documento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {outputText}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Nova Análise
        </h2>
        <p className="text-muted-foreground mt-1">Envie seus documentos para análise por IA</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Análise</CardTitle>
          <CardDescription>Selecione o tipo de análise e faça upload dos documentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Análise</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              disabled={loadingTypes}
            >
              <option value="">{loadingTypes ? 'Carregando...' : 'Selecione um tipo'}</option>
              <option value="matricula-inteiro-teor">MATRÍCULA (INTEIRO TEOR)</option>
              {analysisTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload de Documento</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt"
            />
            <label
              htmlFor="file-upload"
              className="block border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-accent/5 transition-all"
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-primary mb-1">Clique para selecionar arquivos</p>
              <p className="text-sm text-muted-foreground">ou arraste e solte aqui</p>
              <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX, TXT até 10MB</p>
            </label>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Arquivos selecionados:</p>
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border"
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedType || files.length === 0}
            className="w-full"
            size="lg"
          >
            <PenLine className="w-5 h-5 mr-2" />
            Enviar para Análise
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

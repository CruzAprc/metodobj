
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from '../components/Header';
import { Camera, Calendar, TrendingUp, Lock, CheckCircle, Upload, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EvaluationAccess {
  id: string;
  user_id: string;
  unlock_date: string;
  days_required: number;
  is_unlocked: boolean;
  created_at: string;
  updated_at: string;
}

interface EvaluationPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  photo_type: 'frente' | 'costas' | 'lado';
  evaluation_period: string;
  ai_analysis?: any;
  created_at: string;
  updated_at: string;
}

const Avaliacao = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [evaluationAccess, setEvaluationAccess] = useState<EvaluationAccess | null>(null);
  const [currentPhotos, setCurrentPhotos] = useState<EvaluationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'analysis'>('photos');
  const [daysUsingApp, setDaysUsingApp] = useState(0);

  useEffect(() => {
    if (user) {
      loadEvaluationData();
    }
  }, [user]);

  const loadEvaluationData = async () => {
    if (!user) return;

    try {
      // Carregar dados do usuário para calcular dias
      const { data: userData } = await supabase
        .from('teste_app')
        .select('data_registro')
        .eq('user_id', user.id)
        .single();

      if (userData) {
        const regDate = new Date(userData.data_registro);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - regDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysUsingApp(diffDays);
      }

      // Carregar status de acesso à avaliação
      const { data: accessData } = await supabase
        .from('user_evaluation_access')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setEvaluationAccess(accessData);

      // Carregar fotos do mês atual se desbloqueado
      if (accessData?.is_unlocked) {
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
        const { data: photosData } = await supabase
          .from('evaluation_photos')
          .select('*')
          .eq('user_id', user.id)
          .eq('evaluation_period', currentMonth);

        setCurrentPhotos(photosData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da avaliação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (photoType: 'frente' | 'costas' | 'lado', file: File) => {
    if (!user || !evaluationAccess?.is_unlocked) return;

    setUploading(true);
    try {
      // Upload da foto para o storage (implementar depois)
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Por enquanto, usar data URL para demonstração
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

        // Verificar se já existe foto deste tipo para este mês
        const existingPhoto = currentPhotos.find(p => p.photo_type === photoType);

        if (existingPhoto) {
          // Atualizar foto existente
          const { error } = await supabase
            .from('evaluation_photos')
            .update({ photo_url: photoUrl, updated_at: new Date().toISOString() })
            .eq('id', existingPhoto.id);

          if (error) throw error;
        } else {
          // Inserir nova foto
          const { error } = await supabase
            .from('evaluation_photos')
            .insert({
              user_id: user.id,
              photo_url: photoUrl,
              photo_type: photoType,
              evaluation_period: currentMonth
            });

          if (error) throw error;
        }

        // Recarregar fotos
        await loadEvaluationData();
        
        toast({
          title: "Sucesso",
          description: `Foto ${photoType} enviada com sucesso!`
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar a foto",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('evaluation_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      await loadEvaluationData();
      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover a foto",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen juju-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  if (!evaluationAccess?.is_unlocked) {
    const daysRemaining = Math.max(0, (evaluationAccess?.days_required || 7) - daysUsingApp);
    
    return (
      <div className="min-h-screen juju-gradient-bg">
        <Header showBack onBack={() => navigate('/dashboard')} title="Avaliação" />
        
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="juju-card text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Lock className="text-white" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Área Bloqueada
            </h2>
            
            <p className="text-gray-600 mb-6">
              Esta área será liberada após {evaluationAccess?.days_required || 7} dias de uso do app para você acompanhar seu progresso.
            </p>
            
            <div className="bg-pink-50 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {daysRemaining}
                </div>
                <p className="text-pink-700 font-medium">
                  dia{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
                </p>
                <div className="mt-3 text-sm text-gray-600">
                  Você está usando o app há {daysUsingApp} dias
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <Camera className="text-pink-500 mr-3" size={20} />
                <span className="text-gray-700">Fotos do progresso</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="text-pink-500 mr-3" size={20} />
                <span className="text-gray-700">Análise comparativa mensal</span>
              </div>
              <div className="flex items-center">
                <Calendar className="text-pink-500 mr-3" size={20} />
                <span className="text-gray-700">Relatório de evolução</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full juju-button mt-6"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header showBack onBack={() => navigate('/dashboard')} title="Minha Avaliação" />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Status desbloqueado */}
        <div className="juju-card mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Parabéns! Área Liberada
          </h2>
          <p className="text-gray-600">
            Você completou {evaluationAccess.days_required} dias usando o app. Agora pode acompanhar seu progresso!
          </p>
          <div className="mt-4 p-3 bg-green-50 rounded-2xl">
            <p className="text-green-700 font-medium">
              ⏰ {daysUsingApp} dias de dedicação!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-2 mb-6 shadow-lg">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📸 Enviar Fotos
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-3 px-6 rounded-xl text-center font-medium transition-all ${
              activeTab === 'analysis'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Análise Comparativa
          </button>
        </div>

        {activeTab === 'photos' && (
          <div className="grid md:grid-cols-3 gap-6">
            {(['frente', 'costas', 'lado'] as const).map((type) => {
              const existingPhoto = currentPhotos.find(p => p.photo_type === type);
              const typeLabels = {
                frente: 'Frente',
                costas: 'Costas',
                lado: 'Lado'
              };

              return (
                <div key={type} className="juju-card">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    📸 Foto {typeLabels[type]}
                  </h3>
                  
                  {existingPhoto ? (
                    <div className="relative">
                      <img 
                        src={existingPhoto.photo_url} 
                        alt={`Foto ${typeLabels[type]}`} 
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                      <button 
                        onClick={() => deletePhoto(existingPhoto.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center">
                      <Camera className="text-pink-400 mx-auto mb-4" size={48} />
                      <p className="text-gray-600 mb-4">Adicione sua foto {typeLabels[type].toLowerCase()}</p>
                      <label className="juju-button-outline cursor-pointer inline-flex items-center gap-2">
                        <Upload size={16} />
                        Escolher Foto
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(type, file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="juju-card">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              📊 Análise Comparativa Mensal
            </h3>
            
            {currentPhotos.length === 3 ? (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {currentPhotos.map((photo) => (
                    <div key={photo.id}>
                      <p className="text-center font-medium text-gray-700 mb-2 capitalize">
                        {photo.photo_type}
                      </p>
                      <img 
                        src={photo.photo_url} 
                        alt={photo.photo_type} 
                        className="w-full h-48 object-cover rounded-xl" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
                  <h4 className="font-bold text-gray-800 mb-3">🤖 Análise de IA</h4>
                  <p className="text-gray-600 mb-4">
                    Suas fotos estão sendo analisadas por nossa IA especializada em análise corporal.
                    Em breve você receberá insights detalhados sobre seu progresso!
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-pink-600">{daysUsingApp}</div>
                      <div className="text-xs text-gray-600">Dias de Dedicação</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">3</div>
                      <div className="text-xs text-gray-600">Fotos Completas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">⭐</div>
                      <div className="text-xs text-gray-600">Progresso</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="text-gray-400 mx-auto mb-4" size={64} />
                <h4 className="text-lg font-bold text-gray-600 mb-2">
                  Complete suas fotos para análise
                </h4>
                <p className="text-gray-500 mb-4">
                  Você precisa enviar as 3 fotos (frente, costas e lado) para gerar a análise comparativa.
                </p>
                <p className="text-sm text-gray-400">
                  Fotos enviadas: {currentPhotos.length}/3
                </p>
                <button
                  onClick={() => setActiveTab('photos')}
                  className="juju-button mt-4"
                >
                  Ir para Envio de Fotos
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Avaliacao;

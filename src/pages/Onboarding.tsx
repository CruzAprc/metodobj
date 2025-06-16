
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Target, Utensils, TrendingUp, BarChart3 } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Nutrição Inteligente",
      description: "Sistema alimentar baseado em dados e objetivos específicos",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Treino Eficiente", 
      description: "Protocolos otimizados para máximos resultados em menor tempo",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Análise de Dados",
      description: "Métricas precisas para acompanhar sua evolução",
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-sky-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Voltar ao Login
          </button>
        </div>

        {/* Logo e Título */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">DJ</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">MÉTODO DJ</h1>
          <p className="text-gray-600 text-sm">
            Ele traz a força. Ela alivia a consciência.
            <br />
            Juntos criamos o método que vai
            <br />
            <span className="text-pink-600 font-semibold">transformar seu corpo</span>
          </p>
        </motion.div>

        {/* Vídeo Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Sistema Método DJ</h2>
              <p className="text-blue-100 text-sm mb-4">
                Descubra o sistema completo para atingir seus objetivos de forma consistente
              </p>
              
              <div className="relative bg-blue-400/30 rounded-lg p-8 mb-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-blue-100">
                <span>🕐 3:45 min</span>
                <span>📹 Vídeo explicativo</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Resultados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-center text-gray-800 mb-4">
            Resultados Reais ✨
          </h3>
          
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">AC</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 italic">
                    "Metodologia incrível! Finalmente encontrei algo que funciona de verdade."
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-800">Ana Costa</span>
                    <span className="text-xs text-green-600 font-medium">-10kg em 3 meses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Button 
            onClick={() => navigate('/dados-pessoais')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Começar com o Método
          </Button>
          
          <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
            <span className="mr-2">⏱️</span>
            Apenas 5 minutos para personalizar tudo para você
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;

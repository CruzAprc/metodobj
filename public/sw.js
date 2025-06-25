// 🌸 JUJU GIRL FIT - SERVICE WORKER PWA SIMPLIFICADO
// Estratégia: Cache MÍNIMO, interferência MÍNIMA, dados sempre da rede

const CACHE_NAME = 'juju-fit-v2.0.0';
const STATIC_CACHE = 'juju-static-v2.0.0';

// APENAS assets estáticos essenciais para PWA
const STATIC_ASSETS = [
  '/manifest.json',
  '/offline.html'
];

// URLs que NUNCA devem ser interceptadas (passa direto)
const NEVER_INTERCEPT = [
  // APIs críticas
  'supabase.co',
  'webhook.sv-02.botfai.com.br',
  // Recursos externos
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'google-analytics.com',
  'googletagmanager.com',
  // Rotas da aplicação
  '/login',
  '/dashboard',
  '/quiz',
  '/api',
  '/auth',
  '/rest',
  '/realtime',
  '/storage'
];

// 🚀 INSTALAÇÃO
self.addEventListener('install', (event) => {
  console.log('🌸 Juju Fit SW v2.0.0: Instalando (modo simplificado)...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('💾 Cache mínimo criado');
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('⚠️ Alguns assets não puderam ser cacheados (normal)');
      });
    }).then(() => {
      console.log('✅ SW instalado - modo não intrusivo');
      return self.skipWaiting();
    })
  );
});

// 🔄 ATIVAÇÃO
self.addEventListener('activate', (event) => {
  console.log('🌸 Juju Fit SW v2.0.0: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW ativo - interferência mínima');
      return self.clients.claim();
    })
  );
});

// 📡 INTERCEPTAÇÃO MÍNIMA
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // REGRA 1: Ignorar extensões do browser
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://')) {
    return;
  }
  
  // REGRA 2: NUNCA interceptar URLs críticas (deixa passar direto)
  if (shouldNeverIntercept(url)) {
    console.log('🌐 Passando direto (não interceptado):', request.url);
    return; // Deixa o browser fazer o fetch normal
  }
  
  // REGRA 3: Interceptar APENAS para oferecer página offline em caso de erro
  if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // REGRA 4: Todos os outros requests passam direto
  console.log('🌐 Fetch direto:', request.url);
});

// 🌐 ESTRATÉGIA SIMPLES: Network first, offline page como fallback
async function handleNavigationRequest(request) {
  try {
    console.log('📱 Navegação:', request.url);
    
    // Tentar buscar da rede (sem timeout agressivo)
    const response = await fetch(request);
    
    if (response.ok) {
      return response;
    }
    
    // Se resposta não for ok, tentar novamente
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.log('📱 Erro de rede, tentando página offline...', error.message);
    
    // Última opção: página offline (apenas se estiver no cache)
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Se nem a página offline existir, deixa o erro passar
    return new Response('Aplicação indisponível', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// 🔔 PUSH NOTIFICATIONS (mantido para PWA)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Nova atualização disponível!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Juju Girl Fit', options)
  );
});

// 👆 CLICK EM NOTIFICAÇÃO
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// 🔍 HELPER: Verificar se deve interceptar
function shouldNeverIntercept(url) {
  return NEVER_INTERCEPT.some(pattern => 
    url.href.includes(pattern) || 
    url.pathname.includes(pattern) ||
    url.hostname.includes(pattern)
  );
}

// 📱 MESSAGE HANDLING
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🌸 Juju Girl Fit SW v2.0.0 - Modo não intrusivo ativado!'); 
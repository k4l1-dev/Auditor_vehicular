document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('dataForm');
  const tableBody = document.querySelector('#dataTable tbody');
  const exportButton = document.getElementById('exportButton');
  const exportPdfButton = document.getElementById('exportPdfButton');
  const resetButton = document.getElementById('resetButton');
  const buttons = document.querySelectorAll('.select-button');
  let selectedButton = null;
  let counter = 1;

  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (selectedButton) {
        selectedButton.classList.remove('active');
      }
      selectedButton = button;
      button.classList.add('active');
    });
  });

  
  window.addEventListener('load', () => {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      const rows = JSON.parse(savedData);
      rows.forEach(row => {
        addRowToTable(row);
      });
    }
  });

  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;
    const input4 = document.getElementById('input4').value;

    if (!selectedButton) {
      alert('Por favor, selecciona una opción.');
      return;
    }

    const selection = selectedButton.dataset.value;
    const currentTime = new Date().toLocaleTimeString();

    const rowData = [counter++,currentTime, input1, selection, input2, input3, input4,];
    addRowToTable(rowData);
    saveDataToLocalStorage();

    form.reset();
    if (selectedButton) {
      selectedButton.classList.remove('active');
      selectedButton = null;
    }
  });

  
  function addRowToTable(rowData) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = rowData.map(data => `<td>${data}</td>`).join('');
    tableBody.appendChild(newRow);
  }

  
  function saveDataToLocalStorage() {
    const rows = Array.from(tableBody.querySelectorAll('tr')).map(row => {
      return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
    });
    localStorage.setItem('tableData', JSON.stringify(rows));
  }

  
  resetButton.addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas borrar todos los datos?")) {
      tableBody.innerHTML = '';
      localStorage.removeItem('tableData');
    }
  });

  
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '¿Estás seguro de que deseas salir? Los datos no guardados podrían perderse.';
  });


  exportButton.addEventListener('click', () => {
    const rows = document.querySelectorAll('#dataTable tr');
    const csvContent = Array.from(rows)
      .map(row => {
        const cells = row.querySelectorAll('th, td');
        return Array.from(cells).map(cell => cell.textContent).join(",");
      })
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'datos_registrados.csv');
    link.click();
  });

  exportPdfButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text("Datos Registrados", 10, 10);

    const rows = [];
    document.querySelectorAll('#dataTable tbody tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowData = Array.from(cells).map(cell => cell.textContent);
      rows.push(rowData);
    });

    pdf.autoTable({
      head: [['#', 'Hora de Registro', 'Placa 1', 'Tipo de Vehiculo', 'Ejes', 'Placa 2', 'Ejes']],
      body: rows,
      startY: 20
    });

    pdf.save("datos_registrados.pdf");
  });
});

document.getElementById("generatePDF").addEventListener("click", async function() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const dataAplicacao = document.getElementById("dataAplicacao").value;
    const cidade = document.getElementById("cidade").value;
    const modeloVeiculo = document.getElementById("modeloVeiculo").value;
    const empresa = document.getElementById("empresa").value;
    const cnpj = document.getElementById("cnpj").value;
    const cpf = document.getElementById("cpf").value;
    const vendedor = document.getElementById("vendedor").value;
    const uf = document.getElementById("uf").value;
    const emailVendedor = document.getElementById("emailVendedor").value;
    const numeroPedido = document.getElementById("numeroPedido").value;
    const Placa = document.getElementById("Placa").value;
    const vltLateralTraseiro = document.getElementById("vltLateralTraseiro").value;
    const vltParabrisa = document.getElementById("vltParabrisa").value;
    const vltTetoSolar = document.getElementById("vltTetoSolar").value;
    const observacao = document.getElementById("observacao").value;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !email || !dataAplicacao || !cidade || !modeloVeiculo || !empresa || !cnpj || !cpf || !vendedor || !uf || !emailVendedor || !numeroPedido || !Placa || !vltLateralTraseiro || !vltParabrisa || !vltTetoSolar) {
        alert("Por favor, preencha todos os campos");
        return;
    }

    // Convertendo a data para o formato "dia/mês/ano"
    const dataAplicacaoParts = dataAplicacao.split('-');
    const dia = dataAplicacaoParts[2];
    const mes = dataAplicacaoParts[1];
    const ano = dataAplicacaoParts[0];
    const dataAplicacaoFormatada = `${dia}/${mes}/${ano}`;

    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Tamanho A4

    const { width, height } = page.getSize();
    const fontSize = 11;
    const lineHeight = fontSize * 1.5;

    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Carrega a imagem de fundo
    const imageUrl = 'media/background.png'; // Caminho da imagem de fundo
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);

    // Desenha a imagem de fundo
    page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height,
    });

    // Texto do certificado
    const text = `CLIENTE\nNome: ${nome}\nEmail: ${email}\nCidade: ${cidade} — CPF: ${cpf}\nModelo: ${modeloVeiculo}\nPlaca/Chassi do Veículo: ${Placa}\n\nAPLICADOR\nVendedor: ${vendedor}\nEmpresa: ${empresa} — CNPJ: ${cnpj}\nUF: ${uf} — Email do Vendedor: ${emailVendedor}\nNúmero do Pedido: ${numeroPedido}\nVLT Lateral e Traseiro: ${vltLateralTraseiro}\nVLT Parabrisa: ${vltParabrisa}\nVLT Teto Solar: ${vltTetoSolar}\nData de Aplicação: ${dataAplicacaoFormatada}\nObservação: ${observacao}`;

    // Quebra o texto em linhas
    const lines = text.split('\n');

    // Calcula a altura total do texto
    const textHeight = lines.length * lineHeight;

    // Calcula a posição inicial para desenhar o texto
    const textX = 130;
    let textY = height - 132;

    // Desenha o texto
    for (const line of lines) {
        page.drawText(line, {
            x: textX,
            y: textY,
            size: fontSize,
            font: font,
            lineHeight: lineHeight,
            color: PDFLib.rgb(0, 0, 0),
            textAlign: 'left',
        });
        textY -= lineHeight;
    }

    // Salva o PDF
    const pdfBytes = await pdfDoc.save();

    // Cria um Blob com os bytes do PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Cria um link para download do PDF
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Comprovante.pdf';
    link.click();
});
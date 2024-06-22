const { ipcRenderer } = require('electron');

// Listener para adicionar item na tabela
ipcRenderer.on('productsTableAdd', (event, data) => {
    
    const tabela = document.getElementById('productsTable')
    const newLine = tabela.insertRow()
    newLine.insertCell(0).textContent = data.name
    newLine.insertCell(1).textContent = data.sku
    newLine.insertCell(2).textContent = 'R$ ' + data.basePrice.toFixed(2)
    newLine.insertCell(3).textContent = 'R$ ' + data.inCash.toFixed(2)
    newLine.insertCell(4).textContent = data.discont.toFixed(0) + '%'
    newLine.insertCell(5).textContent = data.soldInfo
})

// Listener para editar os textos do rodapé
ipcRenderer.on('textEdit', (event, data) => {
    
    switch (data.option) {
        
        case 'messages':
            
            document.getElementById('messages').innerText = `Mensagens: ${data.value}`
            break
        
        case 'success':
            
            document.getElementById('success').innerText = `Sucesso: ${data.value}`
            break
    
        case 'error':
            
            document.getElementById('error').innerText = `Erro: ${data.value}`
            break

        case 'username':
            
            document.getElementById('username').innerText = `Usuário: ${data.value}`
            break

        case 'resetSearch':

            ResetButtonSearch()
            break
    }
})

// Função para iniciar busca de produtos
function InitSearch() {
    
    let init = document.getElementById('init')
    let menu = document.getElementById('menu')
    let buttons = menu.getElementsByTagName('button')
    
    if (init.innerText === 'Iniciar') {

        init.innerText = 'Parar'
        init.style.backgroundColor = '#420000'
        let btnBlackList = ['init','clean','browser','console']

        for (let i = 0; i < buttons.length; i++) {
    
            if (!btnBlackList.includes(buttons[i].id)) {

                buttons[i].disabled = true
            }
        }
        
        let table = document.getElementById('productsTable')
        let rows = table.getElementsByTagName('tr')

        for (let i = rows.length - 1; i > 0; i--) {
            
            table.deleteRow(i)
        }
    
    } else {

        init.innerText = 'Iniciar'
        init.style.backgroundColor = 'transparent'

        for (let i = 0; i < buttons.length; i++) {
        
            buttons[i].disabled = false
        }
    }
    
    ipcRenderer.send('execAction', 'init')
}

function ResetButtonSearch() {
    
    let init = document.getElementById('init')
    let menu = document.getElementById('menu')
    let buttons = menu.getElementsByTagName('button')

    init.innerText = 'Iniciar'
    init.style.backgroundColor = 'transparent'

    for (let i = 0; i < buttons.length; i++) {
    
        buttons[i].disabled = false
    }
}

// Função para encaminhar solicitações
function ExecAction(option) {

    ipcRenderer.send('execAction', option)
}

// Função para limpar a tabela
function CleanTable() {
    
    let table = document.getElementById('productsTable')
    let rows = table.getElementsByTagName('tr')
    let init = document.getElementById('init')
    
    if (init.innerText === 'Iniciar') {
    
        document.getElementById('messages').innerText = 'Mensagens: 0'
        document.getElementById('success').innerText = 'Sucesso: 0'
        document.getElementById('error').innerText = 'Erro: 0'
    }
    
    for (let i = rows.length - 1; i > 0; i--) {
        
        table.deleteRow(i)
    }
}

// Funções da tabela -----------------------------------------------------------------------------------------------------------
let productsTable = document.getElementById('productsTable')

// Adiciona evento de clique (esquerdo) ao elemento
productsTable.addEventListener('click', function(e) {
    
    // Verifica o elemento clicado
    if(e.target && e.target.nodeName === 'TD') {
      
        // Remove a classe 'selected' de todas as linhas
        document.querySelectorAll('.selected').forEach(function(selected) {
        
            selected.classList.remove('selected')
        })
        
        // Adiciona a classe 'selected' à linha clicada
        e.target.parentNode.classList.add('selected')
    }
})

// Adiciona evento de clique duplo ao elemento
productsTable.addEventListener('dblclick', function(e) {

    // Verifica o elemento clicado
    if(e.target && e.target.nodeName === 'TD') {
      
        // Captura a linha completa
        let tr = e.target.parentNode
    
        // Chama a função e exibe os valores no console
        ipcRenderer.send('buyAction', tr.cells[1].textContent)
    }
})

// Adiciona evento de clique (direito) ao elemento
productsTable.addEventListener('contextmenu', function(e) {

    // Verifica o elemento clicado
    if(e.target && e.target.nodeName === 'TD') {
    
        // Copia o elemento para o clipboard
        navigator.clipboard.writeText(e.target.textContent)
    }
})
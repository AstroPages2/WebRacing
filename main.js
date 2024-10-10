document.addEventListener("DOMContentLoaded", function() {
    let carrinho = [];

    const carrinhoSalvo = localStorage.getItem('carrinho');
    if(carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }

    function salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function adicionarAoCarrinho(produto) {
        const produtoNoCarrinho = carrinho.find(item => item.id === produto.id);
        if (produtoNoCarrinho) {
            produtoNoCarrinho.quantidade += 1;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }

        salvarCarrinho();
        console.log('Carrinho:', carrinho);

        showPopup();
    }

    function showPopup() {
        let popup = document.getElementById('popup');

        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'popup';
            popup.classList.add('popup');
            document.body.appendChild(popup);
        }

        // Adicionar a classe para exibir o popup
        popup.classList.add('show');
        popup.innerHTML = `
        <a href = "pages/carrinho.html" target = "_blank">Produto adicionado ao carrinho. 
        Clique para conferir<a/>
        `;

        // Remover o popup após 3 segundos
        setTimeout(() => {
            popup.classList.remove('show');
            popup.remove();
        }, 2000);
    }

    // Carregar produtos e montar cards
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            // Exibir todos os produtos inicialmente
            exibirProdutos(data.produtos);

            // Adicionar eventos nas checkboxes para filtrar os produtos
            document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    filtrarProdutos(data.produtos);
                });
            });
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    // Função para exibir os produtos
    function exibirProdutos(produtos) {
        const productsContainer = document.getElementById('produtos-list');
        productsContainer.innerHTML = ''; // Limpar produtos anteriores
        produtos.forEach(produto => {
            const productCard = document.createElement('div');
            productCard.classList.add('card');

            if (!produto.disp) {
                productCard.classList.add('indisponivel');
            }

            let buttonText, buttonHref;
            if (!produto.disp) {
                const phoneNumber = '+555181351657';
                const message = `Olá, tenho interesse em encomendar a peça ${produto.nome}`;
                const EncomendaUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);

                buttonText = 'Encomendar';
                buttonHref = EncomendaUrl;
            } else {
                buttonText = 'Comprar';
                buttonHref = `pages/carrinho.html?product_id=${produto.id}`;
            }

            productCard.innerHTML = `
                <img src="imgs/${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.disp ? 'Disponível' : 'Indisponível'}</p>
                    <p class="card-price">${produto.preco}</p>
                    
                    <button class="cart" data-id="${produto.id}">
                    Adicionar
                    <i class="fa-solid fa-cart-plus"></i></button>
                </div>
            `;

            const btnAdicionarCarrinho = productCard.querySelector('.cart');
            btnAdicionarCarrinho.addEventListener('click', function() {
                adicionarAoCarrinho(produto);
            });

            productsContainer.appendChild(productCard);
        });
    }

    // Função para filtrar os produtos com base nas checkboxes
    function filtrarProdutos(produtos) {
        // Pega as categorias selecionadas nas checkboxes
        const checkboxes = document.querySelectorAll('.filters input[type="checkbox"]:checked');
        const categoriasSelecionadas = Array.from(checkboxes).map(checkbox => checkbox.value);

        // Filtra os produtos de acordo com as categorias
        const produtosFiltrados = produtos.filter(produto => categoriasSelecionadas.includes(produto.categoria));

        // Exibe os produtos filtrados
        exibirProdutos(produtosFiltrados.length > 0 ? produtosFiltrados : produtos);
    }
});

function redirectToSearchPage(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('searchbar').value;
    if (searchQuery) {
        window.location.href = `search_results.html?query=${encodeURIComponent(searchQuery)}`;
    }
}

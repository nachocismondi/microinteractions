const resources = [
  {
    id: 1,
    title: "Obsidian app icon",
    image:
      "images/obsidian-logo.gif",
    tag: "Bento",
    type: "Interaction",
    description:
      "A comprehensive tool for managing your freelance business, handling everything from proposals to invoicing.",
  },
]

let activeFilter = "All"
let currentPage = 1;
const itemsPerPage = 20;

function createResourceCard(resource) {
  return `
        <div class="col">
            <div class="card h-100 resource-card" data-id="${resource.id}">
                <img src="${resource.image}" class="card-img-top resource-image" alt="${resource.title}">
                <div class="card-body">
                    <h5 class="card-title">${resource.title}</h5>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="badge tag">${resource.tag}</span>
                        <small class="text-muted">${resource.type}</small>
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderResources() {
  const resourceGrid = document.getElementById("resource-grid")
  const filteredResources =
    activeFilter === "All" ? resources : resources.filter((resource) => resource.tag === activeFilter)
  
  // Calcular el número de items a mostrar
  const itemsToShow = currentPage * itemsPerPage;
  const resourcesToRender = filteredResources.slice(0, itemsToShow);
  
  resourceGrid.innerHTML = resourcesToRender.map(createResourceCard).join("")
  
  // Agregar o actualizar el botón de "Cargar más"
  updateLoadMoreButton(filteredResources.length, itemsToShow);

  // Add click event listeners to the cards
  document.querySelectorAll(".resource-card").forEach((card) => {
    card.addEventListener("click", () => {
      const resourceId = Number.parseInt(card.dataset.id)
      const resource = resources.find((r) => r.id === resourceId)
      showResourceModal(resource)
    })
  })
}

function updateLoadMoreButton(totalItems, currentlyShown) {
  let loadMoreBtn = document.querySelector('.load-more-btn');
  const container = document.querySelector('#resource-grid').parentElement;
  
  // Eliminar el botón existente si existe
  if (loadMoreBtn) {
    loadMoreBtn.remove();
  }
  
  // Mostrar el botón solo si hay más items para cargar
  if (currentlyShown < totalItems) {
    loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.textContent = 'Cargar más';
    
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderResources();
    });
    
    container.appendChild(loadMoreBtn);
  }
}

function updateFilterButtons() {
  const filterButtons = document.getElementById("filter-buttons")
  const tags = ["All", ...new Set(resources.map((resource) => resource.tag))]

  filterButtons.innerHTML = tags
    .map((tag) => {
      const count = tag === "All" ? resources.length : resources.filter((r) => r.tag === tag).length
      return `
      <button class="btn btn-outline-primary ${activeFilter === tag ? "active" : ""}" data-filter="${tag}">
        ${tag} <span class="badge">${count}</span>
      </button>
    `
    })
    .join("")

  // Add click event listeners to the filter buttons
  filterButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;
      
      // Si el filtro clickeado es el que ya está activo, volver a "All"
      if (activeFilter === selectedFilter) {
        activeFilter = "All";
      } else {
        activeFilter = selectedFilter;
      }
      
      currentPage = 1; // Resetear la página al cambiar el filtro
      updateFilterButtons();
      renderResources();
    })
  })
}

function showResourceModal(resource) {
  const modalElement = document.getElementById("resourceModal")
  const modal = new bootstrap.Modal(modalElement)
  const modalTitle = document.getElementById("resourceModalLabel")
  const modalBody = document.querySelector("#resourceModal .modal-body")

  modalTitle.textContent = resource.title
  modalBody.innerHTML = `
    <div class="mb-3">
      <span class="badge tag">${resource.tag}</span>
      <small class="text-muted ms-2">${resource.type}</small>
    </div>
    <p>${resource.description}</p>
    <button class="btn btn-primary mb-3">Learn More</button>
    <img src="${resource.image}" class="img-fluid rounded" alt="${resource.title}">
  `

  modal.show()
}

function handleStickyNav() {
  const filterNav = document.querySelector('.filter-nav');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 0) {
    filterNav.classList.add('scrolled');
  } else {
    filterNav.classList.remove('scrolled');
  }
}

function animateOnScroll() {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
  });
}

function handleModalAnimation() {
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.querySelector(`#${modalId}`);
      
      modal.classList.add('active');
    });
  });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  updateFilterButtons()
  renderResources()
  handleStickyNav()
  animateOnScroll()
  handleModalAnimation()
})


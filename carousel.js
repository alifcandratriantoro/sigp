var map = L.map("map").setView([-8.38, 115.21], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const waterfalls = [
  {
    name: "Kembar Lipah",
    coords: [-8.379042, 115.207636],
    description: "Banjar Lipah, Desa Petang",
    link: "#kembar-lipah",
  },
  {
    name: "Goa Gong",
    coords: [-8.348815, 115.212931],
    description: "Desa Batu Lantang, Sulangai",
    link: "#goa-gong",
  },
  {
    name: "Nungnung",
    coords: [-8.3297694, 115.2293907],
    description: "Desa Pelaga",
    link: "#nungnung",
  },
  {
    name: "Penikit",
    coords: [-8.342801, 115.231008],
    description: "Desa Belok Sidan",
    link: "#penikit",
  },
];

waterfalls.forEach((wf) => {
  L.marker(wf.coords)
    .addTo(map)
    .bindPopup(
      `<b>${wf.name}</b><br>${wf.description}<br><a href="${wf.link}">Detail</a>`
    );
});

function filterWaterfalls() {
  const filter = document.getElementById("filter-access").value.toLowerCase();
  document.querySelectorAll(".waterfall").forEach((section) => {
    const akses = section.getAttribute("data-akses").toLowerCase();
    if (filter === "all" || akses.includes(filter)) {
      section.style.display = "";
    } else {
      section.style.display = "none";
    }
  });
}

function submitReview(id) {
  const textarea = document.getElementById("review-text-" + id);
  const reviewList = document.getElementById("reviews-list-" + id);
  const text = textarea.value.trim();

  if (!text) {
    alert("Tulis ulasan terlebih dahulu.");
    return;
  }

  const p = document.createElement("p");
  p.textContent = text;
  reviewList.appendChild(p);

  let reviews = JSON.parse(sessionStorage.getItem("reviews-" + id)) || [];
  reviews.push(text);
  sessionStorage.setItem("reviews-" + id, JSON.stringify(reviews));

  textarea.value = "";
}

window.onload = () => {
  document.querySelectorAll(".waterfall").forEach((section) => {
    const id = section.id;
    const reviewList = document.getElementById("reviews-list-" + id);
    const reviews = JSON.parse(sessionStorage.getItem("reviews-" + id)) || [];
    reviews.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      reviewList.appendChild(p);
    });
  });
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);
  initCarousel();
};

function updateOpenStatus() {
  const now = new Date();

  document.querySelectorAll(".waterfall").forEach((section) => {
    const jamBuka = section
      .querySelector("table tr:nth-child(2) td")
      .textContent.trim();
    const jamTutup = section
      .querySelector("table tr:nth-child(3) td")
      .textContent.trim();
    const statusTd = section.querySelector("table tr:nth-child(4) td.status");

    const [bukaJam, bukaMenit] = jamBuka.split(":").map(Number);
    const [tutupJam, tutupMenit] = jamTutup.split(":").map(Number);

    const bukaTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      bukaJam,
      bukaMenit
    );
    const tutupTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      tutupJam,
      tutupMenit
    );

    let isOpen = bukaTime <= now && now < tutupTime;

    if (statusTd) {
      statusTd.textContent = isOpen ? "Buka" : "Tutup";
      statusTd.style.color = isOpen ? "green" : "red";
      statusTd.style.fontWeight = "bold";
    }
  });
}

function initCarousel() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevButton = carousel.querySelector(".carousel-btn.prev");
    const nextButton = carousel.querySelector(".carousel-btn.next");
    let currentIndex = 0;

    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener("click", () => {
      currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      updateSlidePosition();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      updateSlidePosition();
    });
  });
}

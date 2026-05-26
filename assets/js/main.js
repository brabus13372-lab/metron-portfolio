const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const setYear = () => {
  const year = document.getElementById("year")
  if (year) year.textContent = String(new Date().getFullYear())
}

const setStaggerIndexes = () => {
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.querySelectorAll(".reveal-item")).forEach((item, index) => {
      item.style.setProperty("--i", String(index))
    })
  })
}

const setupHeroWords = () => {
  document.querySelectorAll("[data-hero-line]").forEach((line, lineIndex) => {
    const text = line.getAttribute("data-hero-line") || line.textContent || ""
    const words = text.split(/\s+/).filter(Boolean)

    line.textContent = ""
    line.classList.add("hero-line")

    words.forEach((word, index) => {
      const span = document.createElement("span")
      span.className = "word"
      span.textContent = word
      span.style.transitionDelay = `${lineIndex * 220 + index * 90}ms`
      line.appendChild(span)
      if (index < words.length - 1) line.appendChild(document.createTextNode(" "))
    })
  })
}

const runHero = () => {
  const hero = document.querySelector("[data-hero]")
  if (!hero) return

  if (prefersReducedMotion) {
    hero.classList.add("is-ready")
    return
  }

  requestAnimationFrame(() => {
    hero.classList.add("is-ready")
  })
}

const setupRevealObserver = () => {
  const targets = document.querySelectorAll("[data-reveal]")

  if (prefersReducedMotion) {
    targets.forEach((target) => target.classList.add("is-visible"))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  )

  targets.forEach((target) => observer.observe(target))
}

const setupHeader = () => {
  const header = document.querySelector("[data-header]")
  const progress = document.querySelector("[data-progress]")
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"))
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)

  const onScroll = () => {
    const scrollY = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    const progressValue = max > 0 ? scrollY / max : 0

    if (header) header.classList.toggle("is-scrolled", scrollY > 24)
    if (progress) progress.style.transform = `scaleX(${progressValue})`

    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect()
      return rect.top <= window.innerHeight * 0.42 && rect.bottom > window.innerHeight * 0.42
    })

    navLinks.forEach((link) => {
      const id = link.getAttribute("href")
      link.classList.toggle("is-active", current && id === `#${current.id}`)
    })
  }

  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
}

const setupSmoothAnchors = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href")
      const target = id ? document.querySelector(id) : null
      if (!target) return

      event.preventDefault()
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })
      history.replaceState(null, "", id)
    })
  })
}

setYear()
setStaggerIndexes()
setupHeroWords()
setupRevealObserver()
runHero()
setupHeader()
setupSmoothAnchors()

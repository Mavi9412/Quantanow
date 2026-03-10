from pathlib import Path
p = Path("index.html")
html = p.read_text(encoding="utf-8")
repls = [
    ("<title>Home | QuantaNow</title>", "<title>QuantaNow | AI Product Development Agency</title>"),
    ("Know where your spend is going and manage your finances more efficiently with Milestone.", "AI-powered software development agency that launches your complete product in 60 days. Strategy, design, development, QA and deployment by one team."),
    ("<meta content=\"Home | QuantaNow\" property=\"og:title\"/>", "<meta content=\"QuantaNow | AI Product Development Agency\" property=\"og:title\"/>"),
    ("<meta content=\"Home | QuantaNow\" property=\"twitter:title\"/>", "<meta content=\"QuantaNow | AI Product Development Agency\" property=\"twitter:title\"/>"),

    ("<a href=\"/blog\" class=\"black-nav-links w-nav-link\">Blog</a>", "<a href=\"/process\" class=\"black-nav-links w-nav-link\">Process</a>"),
    ("<a href=\"/about\" class=\"black-nav-links w-nav-link\">About</a>", "<a href=\"/why-us\" class=\"black-nav-links w-nav-link\">Why Us</a>"),
    ("<a href=\"/contact\" class=\"black-nav-links w-nav-link\">Contact</a>", "<a href=\"/industries\" class=\"black-nav-links w-nav-link\">Industries</a>"),
    ("<a href=\"/no-code\" id=\"No-Code\" class=\"black-nav-links w-nav-link\">No Code</a>", "<a href=\"/contact\" id=\"No-Code\" class=\"black-nav-links w-nav-link\">Let\'s Talk</a>"),

    ("Crafting <em class=\"italic-text\">user-centered solutions</em> that drive success ", "We build &amp; launch your <em class=\"italic-text\">AI-powered product</em> in 60 days "),
    ("We offer a range of services, including creating new software, modernizing existing systems, and providing guidance on maximizing technology use.", "From concept to launch, we handle strategy, UI/UX, development, QA, and deployment with one focused AI-enabled product team."),

    ("Services we offer <span class=\"boska-variable-text-opacity-70\">that handles it all.</span>", "Services we offer <span class=\"boska-variable-text-opacity-70\">that launch products fast.</span>"),
    ("<div class=\"growth-heading-32px\">Software development</div>", "<div class=\"growth-heading-32px\">Web Development</div>"),
    ("From ideation to deployment, end-to-end software development services.", "High-performance websites and web applications built with modern stacks and AI workflows."),
    ("<div class=\"growth-heading-32px\">Quality Assurance</div>", "<div class=\"growth-heading-32px\">SaaS Platforms</div>"),
    ("Ensure your products meet the highest standards of quality and reliability. We trust but verify!", "From MVP to scale, we build complete SaaS products ready for users and revenue."),
    ("<div class=\"growth-heading-32px\">Mobile Apps</div>", "<div class=\"growth-heading-32px\">QA &amp; Testing</div>"),
    ("Custom app development tailored to meet your unique needs and requirements.", "Automated and manual QA pipelines that keep releases stable, secure, and production-ready."),
    ("<div class=\"growth-heading-32px\">Data Engineering</div>", "<div class=\"growth-heading-32px\">AI Solutions</div>"),
    ("Help you build scalable, robust, and efficient data pipelines.", "Practical AI features, copilots, and workflow automations integrated directly into your product."),

    ("Our skilled teams build your software with transparency, ensuring a higher return on investment.", "Our process turns ideas into shipped products with speed, clarity, and measurable outcomes."),
    ("<div class=\"p-accordin-slider-heading-32px\">Collaborative Synergy</div>", "<div class=\"p-accordin-slider-heading-32px\">Free Consultation</div>"),
    ("<div class=\"p-accordin-slider-heading-32px\">Innovation</div>", "<div class=\"p-accordin-slider-heading-32px\">AI Planning</div>"),
    ("<div class=\"p-accordin-slider-heading-32px\">Transparency</div>", "<div class=\"p-accordin-slider-heading-32px\">Build &amp; Test</div>"),
    ("<div class=\"p-accordin-slider-heading-32px\">Analyze cashflow</div>", "<div class=\"p-accordin-slider-heading-32px\">Launch &amp; Scale</div>"),
    ("Scan invoices, automate data-entry and route approvals, effortlessly, automatically.", "We align on goals, scope and product requirements in a focused discovery session."),

    ("Collaborate with our experts to achieve a synergistic approach to delivering high-quality solutions that meet your business needs.", "We align business goals, user journeys, and technical scope before writing code."),
    ("Stay ahead of the competition with our cutting-edge software development solutions.", "Architecture, UI flow, and delivery roadmap prepared quickly with AI-assisted planning."),
    ("Experience software development with complete transparency to ensure project success and client satisfaction.", "Weekly demos, rapid iterations, and automated QA across each sprint."),
    ("Optimize software for better performance, efficiency, and user experience.", "Launch in 60 days with support, monitoring, and continuous product improvements."),

    ("I am extremely satisfied with the healthcare software solution developed Quanta Now. Their expertise in the field and attention to detail resulted in a high-quality product that has improved our operations and patient care. Their support throughout the entire process was exceptional, and I would highly recommend their services.&quot;", "QuantaNow delivered exactly what they promised: clear process, fast execution, and a product our users adopted quickly. Their AI-first workflow reduced our delivery time dramatically.&quot;"),
    ("<h1 class=\"heading-ceo\">C.S Javed</h1>", "<h1 class=\"heading-ceo\">Amira Hassan</h1>"),
    ("Founder &amp; CEO, BAPits", "Product Manager, TechStart"),
    ("&quot;Quanta Now did an excellent job developing our healthcare software solution. From the start, their team took the time to understand our unique needs and challenges. The end result was a well-crafted product that has improved both our operational efficiency and the quality of care we provide. They were incredibly supportive throughout the entire process, addressing any issues quickly and professionally. I wouldnât hesitate to recommend their services.&quot;", "&quot;From idea to launch, QuantaNow acted like an extension of our team. The product quality, communication, and speed were exceptional, and the final release was production-ready.&quot;"),
    ("<h1 class=\"heading-ceo\">Mr. Zulqarnain Hashmi</h1>", "<h1 class=\"heading-ceo\">Marcus Thompson</h1>"),
    ("Founder &amp; CEO, MicroMerger (Pvt.) Ltd ", "Co-founder, StyleForward"),

    ("<h1 class=\"feature-hero-heading\">Let&#x27;s grow together!<span class=\"boska-text\"></span></h1>", "<h1 class=\"feature-hero-heading\">Let&#x27;s build your product in 60 days!<span class=\"boska-text\"></span></h1>"),
    ("<div>Get in touch</div>", "<div>Let\'s Talk</div>"),

    ("Transperance", "Transparency"),
    ("We believe in doing things weâre passionate about.", "We deliver with honesty, ownership, and complete visibility."),
    ("We ensure strong communication with our partners to foster an environment of trust.", "We keep communication fast, clear, and proactive at every project stage."),
    ("We put kindness and empathy at the centre of our business.", "We build with users in mind and treat every product decision with empathy."),
    ("We keep our customers at the centre of everything we do.", "We prioritize measurable customer outcomes over vanity metrics."),
    ("Innovation is a core value for us to strive for growth, success, and staying at the cutting edge.", "We use AI to accelerate delivery, improve quality, and scale products efficiently."),

    ("Delivering user-centered applications with excellence.", "AI-powered software development agency launching products in 60 days."),
    ("<a href=\"/blog\" class=\"footer-text-link-16px\">Blog</a>", "<a href=\"/process\" class=\"footer-text-link-16px\">Process</a>"),
    ("<a href=\"/about\" class=\"footer-text-link-16px\">About</a>", "<a href=\"/why-us\" class=\"footer-text-link-16px\">Why Us</a>"),
    ("<a href=\"/contact\" class=\"footer-text-link-16px\">Contact</a>", "<a href=\"/contact\" class=\"footer-text-link-16px\">Let\'s Talk</a>"),
    ("<div class=\"copyright-text\">Â 2023 All rights reserved by <strong>QuantaNow. </strong></div>", "<div class=\"copyright-text\"> 2026 All rights reserved by <strong>QuantaNow.</strong></div>")
]

missing = []
for old, new in repls:
    if old in html:
        html = html.replace(old, new)
    else:
        missing.append(old[:80])

p.write_text(html, encoding="utf-8")
print(f"Applied replacements: {len(repls)-len(missing)}/{len(repls)}")
if missing:
    print("Missing patterns:")
    for m in missing:
        print("-", m)

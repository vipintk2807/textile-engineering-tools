import { InfoNote } from '../components/InfoNote';
import { PageHeader } from '../components/PageHeader';
import { ToolLinkCard } from '../components/ToolLinkCard';
import { CATEGORIES, toHref, type Category, type ToolEntry } from './navigation';

export function HomePage() {
  return (
    <>
      <PageHeader
        title="Textile Engineering Tools"
        description="Free, open-source textile engineering calculators that run in your browser. Each tool shows its units, formula and assumptions so you can check the result yourself."
      />
      <InfoNote>
        Results depend on the accuracy of the values you enter and on the assumptions stated by
        each calculator. They are calculations and estimates, not process recommendations or
        standards-compliance results.
      </InfoNote>
      {CATEGORIES.map((category) => (
        <section key={category.path} className="stack" aria-labelledby={`home-${category.path}`}>
          <h2 id={`home-${category.path}`}>{category.title}</h2>
          <div className="card-grid">
            {category.tools.map((tool) => (
              <ToolLinkCard
                key={tool.path}
                title={tool.title}
                description={tool.description}
                href={toHref(tool.path)}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function CategoryPage({ category }: { category: Category }) {
  return (
    <>
      <PageHeader
        title={category.title}
        description={category.description}
        breadcrumb={[{ label: 'Home', href: toHref('/') }, { label: category.title }]}
      />
      <div className="card-grid">
        {category.tools.map((tool) => (
          <ToolLinkCard
            key={tool.path}
            title={tool.title}
            description={tool.description}
            href={toHref(tool.path)}
          />
        ))}
      </div>
    </>
  );
}

export function ToolPage({ category, tool }: { category: Category; tool: ToolEntry }) {
  const isCategoryPage = category.path === tool.path;
  const breadcrumb = isCategoryPage
    ? [{ label: 'Home', href: toHref('/') }, { label: tool.title }]
    : [
        { label: 'Home', href: toHref('/') },
        { label: category.title, href: toHref(category.path) },
        { label: tool.title },
      ];
  return (
    <>
      <PageHeader title={tool.title} description={tool.description} breadcrumb={breadcrumb} />
      {tool.element}
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHeader
        title="About and Limitations"
        description="What this application does, what it does not do, and how far its results can be relied on."
        breadcrumb={[{ label: 'Home', href: toHref('/') }, { label: 'About and Limitations' }]}
      />
      <section className="panel stack" aria-labelledby="about-purpose">
        <h2 id="about-purpose">Purpose</h2>
        <p>
          Textile Engineering Tools performs routine calculations from values you enter and shows
          the formula, units and assumptions used. It is an open-source project intended to be
          useful to textile practitioners and learners, including those in Tiruppur, Tamil Nadu,
          without assuming that every factory follows the same conventions.
        </p>
      </section>
      <section className="panel stack" aria-labelledby="about-limits">
        <h2 id="about-limits">Limitations</h2>
        <ul className="about-list">
          <li>
            Results are mathematical calculations and estimates. They do not replace laboratory
            testing, approved production procedures, machine manuals, quality specifications or
            professional engineering judgement.
          </li>
          <li>
            Passing software tests shows that the code follows the documented rules. It does not
            show that the rules suit every factory process, and the calculators have not been
            validated against real factory data.
          </li>
          <li>
            The GSM calculator is arithmetic only. It does not implement ASTM D3776/D3776M or IS
            1964 sampling, conditioning or reporting, and no standards compliance is claimed.
          </li>
          <li>
            Fabric consumption uses only the allowance you enter. Marker efficiency describes the
            marker rectangle, not total fabric loss.
          </li>
          <li>
            Dyeing calculations are arithmetic on your inputs. Liquor volume assumes about 1 kg/L.
            The application does not generate dye recipes or recommend chemicals, dosages or process
            conditions.
          </li>
          <li>
            Capacity is theoretical. Efficiency depends on how you defined the expected production.
            OEE depends on your definitions of planned time, downtime, ideal cycle time and good
            output; no target or benchmark is implied.
          </li>
          <li>
            Quality utilities are basic arithmetic. They do not decide whether a lot passes and are
            not a statistical process control system.
          </li>
        </ul>
      </section>
      <section className="panel stack" aria-labelledby="about-privacy">
        <h2 id="about-privacy">Privacy and local operation</h2>
        <p>
          All calculations run in your browser. The application has no account, backend or
          database, does not send your inputs anywhere, and does not store them: values are cleared
          when you reload the page.
        </p>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page not found"
        description="This address does not match any page in the application."
      />
      <p>
        <a href={toHref('/')}>Go to the Home page</a>
      </p>
    </>
  );
}

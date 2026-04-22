interface LegalSection {
  title: string
  content: string
  items?: string[]
}

interface LegalPageProps {
  title: string
  description: string
  sections: LegalSection[]
  lastUpdated: string
}

export default function LegalPage({ title, description, sections, lastUpdated }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
              {section.items && (
                <ul className="mt-3 list-disc list-inside text-gray-600 space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>{lastUpdated}: 2024年1月1日</p>
        </div>
      </div>
    </div>
  )
}

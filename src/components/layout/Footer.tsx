// ─────────────────────────────────────────────
//  Footer — corporate footer with links
// ─────────────────────────────────────────────

export default function Footer() {
  const cols = [
    {
      title: 'Product', icon: 'ti-package',
      links: [
        { label: 'Task Manager', icon: 'ti-layout-kanban' },
        { label: 'Analytics',    icon: 'ti-chart-bar'     },
        { label: 'Projects',     icon: 'ti-folders'       },
        { label: 'Integrations', icon: 'ti-plug'          },
      ],
    },
    {
      title: 'Resources', icon: 'ti-book',
      links: [
        { label: 'Documentation', icon: 'ti-file-text'  },
        { label: 'Guides',        icon: 'ti-compass'    },
        { label: 'Changelog',     icon: 'ti-history'    },
        { label: 'Support',       icon: 'ti-headset'    },
      ],
    },
    {
      title: 'Company', icon: 'ti-building',
      links: [
        { label: 'About',           icon: 'ti-info-circle'     },
        { label: 'Careers',         icon: 'ti-users'           },
        { label: 'Privacy Policy',  icon: 'ti-lock'            },
        { label: 'Terms of Service',icon: 'ti-file-certificate'},
      ],
    },
  ];

  return (
    <footer className="nav-bg mt-12" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 pb-6">
        <div className="flex justify-between flex-wrap gap-8 pb-8 border-b border-white/12">

          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-accent font-bold text-[12px]">PC</div>
              <span className="text-white font-semibold text-[15px]">ProveIT Catalysts</span>
            </div>
            <p className="text-[12px] leading-relaxed text-white/55">
              Professional task intelligence for high-performing individuals.
              Built on clarity, driven by results.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-3">
                <i className={`ti ${col.icon} text-[14px]`} aria-hidden="true" />
                {col.title}
              </h4>
              {col.links.map(link => (
                <a
                  key={link.label}
                  className="flex items-center gap-1.5 text-[13px] text-white/65 hover:text-white mb-1.5 cursor-pointer transition-colors"
                >
                  <i className={`ti ${link.icon} text-[13px] opacity-60`} aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-5">
          <span className="flex items-center gap-1.5 text-[12px] text-white/40">
            <i className="ti ti-copyright text-[13px]" aria-hidden="true" />
            2025 ProveIT Catalysts. All rights reserved.
          </span>
          <span className="text-[11px] text-white/35">Built with precision for high-performers.</span>
        </div>
      </div>
    </footer>
  );
}

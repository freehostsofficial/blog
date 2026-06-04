interface AccordionItemProps {
  trigger: React.ReactNode
  children: React.ReactNode
  open?: boolean
}

export function AccordionItem({ trigger, children, open }: AccordionItemProps) {
  return (
    <details className="accordion-item" open={open}>
      <summary className="accordion-trigger">{trigger}</summary>
      <div className="accordion-content">{children}</div>
    </details>
  )
}

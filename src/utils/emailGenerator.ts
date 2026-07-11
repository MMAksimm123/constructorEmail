export interface EmailBlock {
  id: string
  type: string
  content?: string
  src?: string
  alt?: string
  color?: string
  columns?: { content: string }[]
}

export function generateHTML(blocks: EmailBlock[]): string {
  const blocksHTML = blocks.map(block => {
    switch (block.type) {
      case 'text':
        return `<p style="font-family: Arial, sans-serif; font-size: 14px; color: #333; margin: 0 0 10px 0;">${block.content || ''}</p>`
      case 'heading':
        return `<h2 style="font-family: Arial, sans-serif; font-size: 24px; color: #1a1a1a; margin: 0 0 10px 0;">${block.content || ''}</h2>`
      case 'image':
        return block.src
          ? `<img src="${block.src}" alt="${block.alt || ''}" style="max-width: 100%; height: auto; display: block;" />`
          : `<div style="background: #f0f0f0; padding: 40px; text-align: center; color: #999;">Изображение</div>`
      case 'button':
        return `<a href="#" style="display: inline-block; background: ${block.color || '#4f46e5'}; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">${block.content || 'Кнопка'}</a>`
      case 'divider':
        return `<hr style="border: 1px solid #e0e0e0; margin: 20px 0;" />`
      case 'columns':
        const cols = block.columns?.map(col =>
          `<div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px;">${col.content || ''}</div>`
        ).join('') || ''
        return `<div style="display: flex; gap: 20px; justify-content: space-between;">${cols}</div>`
      default:
        return ''
    }
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Preview</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${blocksHTML}
        </div>
      </body>
    </html>
  `
}

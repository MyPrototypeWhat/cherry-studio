import 'katex/dist/katex.min.css'
import 'katex/dist/contrib/copy-tex'
import 'katex/dist/contrib/mhchem'

import MarkdownShadowDOMRenderer from '@renderer/components/MarkdownShadowDOMRenderer'
import { useSettings } from '@renderer/hooks/useSettings'
import type { Message } from '@renderer/types'
import { escapeBrackets, removeSvgEmptyLines, withGeminiGrounding } from '@renderer/utils/formats'
import { isEmpty } from 'lodash'
import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import markdownItMathjax3 from 'markdown-it-mathjax3'
import { motion } from 'motion/react'
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import CodeBlock from './CodeBlock'
import ImagePreview from './ImagePreview'
import Link from './Link'

interface Props {
  message: Message
  citationsData?: Map<
    string,
    {
      url: string
      title?: string
      content?: string
    }
  >
}

const Markdown: FC<Props> = ({ message, citationsData }) => {
  const { t } = useTranslation()
  const { renderInputMessageAsMarkdown, mathEngine } = useSettings()

  // 配置 markdown-it
  const md = useMemo(() => {
    const instance = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })

    if (mathEngine === 'KaTeX') {
      instance.use(markdownItKatex)
    } else {
      instance.use(markdownItMathjax3)
    }

    return instance
  }, [mathEngine])

  // 存储已解析的块
  const markdownRef = useRef<HTMLSpanElement>(null) // 缓冲区存储原始消息

  const messageContent = useMemo(() => {
    const empty = isEmpty(message.content)
    const paused = message.status === 'paused'
    const content = empty && paused ? t('message.chat.completion.paused') : withGeminiGrounding(message)
    return removeSvgEmptyLines(escapeBrackets(content))
  }, [message, t])

  const components = useCallback(() => {
    const baseComponents = {
      a: (props) => {
        if (props.href && citationsData?.has(props.href)) {
          return <Link {...props} citationData={citationsData.get(props.href)} />
        }
        return <Link {...props} />
      },
      code: CodeBlock,
      img: ImagePreview
    }

    if (messageContent.includes('<style>')) {
      baseComponents.style = MarkdownShadowDOMRenderer
    }

    return baseComponents
  }, [messageContent, citationsData])

  if (message.role === 'user' && !renderInputMessageAsMarkdown) {
    return <p style={{ marginBottom: 5, whiteSpace: 'pre-wrap' }}>{messageContent}</p>
  }

  useEffect(() => {
    const tokens = md.parse(messageContent, {}) // 解析完整内容
    const html = md.renderer.render(tokens, md.options, {})
    markdownRef.current.innerHTML = html
  }, [messageContent, md])

  return (
    <motion.span
      ref={markdownRef}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="markdown-block"
    />
  )
}

export default Markdown

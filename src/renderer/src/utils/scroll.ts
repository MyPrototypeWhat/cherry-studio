/**
 * Gets a DOM element by ID or returns the provided element
 * @param elementId - ID of the DOM element to get
 * @param el - Optional existing element reference
 * @returns HTMLElement | null
 */
const getElement = (elementId: string | undefined, el?: HTMLElement): HTMLElement | null => {
  if (el) return el
  return elementId ? document.getElementById(elementId) : null
}

/**
 * Scrolls an element to the bottom
 * @param elementId - ID of the DOM element to scroll
 * @param behavior - Scroll behavior ('auto' | 'smooth')
 */
export const scrollToBottom = ({
  elementId,
  behavior = 'auto',
  el
}: {
  elementId?: string
  behavior?: ScrollBehavior
  el?: HTMLElement
}) => {
  let element = getElement(elementId, el)
  return requestAnimationFrame(() => {
    if (element) {
      console.log('scrollToBottom', !!element)
      element.scrollTo({
        top: element.scrollHeight,
        behavior
      })
    } else {
      element = getElement(elementId, el)
    }
  })
}

/**
 * Checks if an element is scrolled to the bottom
 * @param elementId - ID of the DOM element to check
 * @param threshold - Distance from bottom to consider as "at bottom" (in pixels)
 * @returns boolean indicating if element is at bottom
 */
export const isAtBottom = (elementId: string, { threshold = 30, el }: { threshold?: number; el?: HTMLElement }) => {
  const element = getElement(elementId, el)
  if (!element) return false

  const { scrollTop, scrollHeight, clientHeight } = element
  return scrollHeight - scrollTop - clientHeight < threshold
}

/**
 * Creates a scroll handler that calls the provided callback with the bottom state
 * @param elementId - ID of the DOM element to monitor
 * @param options - Options object containing threshold
 * @param callback - Function to be called with the bottom state
 * @returns Scroll event handler function
 */
export const createScrollHandler = (
  callback: (isAtBottom: boolean, element: HTMLElement, e?: Event) => void,
  { threshold = 30, el, elementId }: { threshold?: number; el?: HTMLElement; elementId?: string } = {}
) => {
  return (e?: Event) => {
    let element: HTMLElement | null = (e?.target as HTMLElement) ?? (e?.srcElement as HTMLElement)
    if (!element && elementId) {
      element = getElement(elementId, el)
    }

    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element
      console.log('createScrollHandler', scrollTop, scrollHeight, clientHeight)
      const isBottom = scrollHeight - scrollTop - clientHeight < threshold
      callback(isBottom, element, e)
    }
  }
}

import { ElMessage } from 'element-plus'

// 是否是移动端
export const isMobile = (): boolean => {
  const ua = navigator.userAgent

  const isMobile =
    /Mobile|Android|BlackBerry|iPhone|iPad|iPod|iOS|Windows Phone|BlackBerry|IEMobile/i.test(ua)

  if (isMobile) {
    return true
  } else {
    return false
  }
}

export const getImagePath = (path: string): string | undefined => {
  if (path) return import.meta.env.VITE_API + import.meta.env.VITE_IMAGE_PATH + '/' + path
}

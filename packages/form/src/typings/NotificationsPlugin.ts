export interface NotificationPluginOptions {
  message: string
  title: string
  timer: number
  infiniteTimer: boolean
  position: string
  type: string
  showLeftIcn: boolean
  showCloseIcn: boolean
  notificationEl: any
  animateIn(): TimelineMax
  animateOut(): TimelineMax
}

export interface NotificationPlugin {
  primary(msg?: string, options?: NotificationPluginOptions): void
  dark(msg?: string, options?: NotificationPluginOptions): void
  success(msg?: string, options?: NotificationPluginOptions): void
  warning(msg?: string, options?: NotificationPluginOptions): void
  error(msg?: string, options?: NotificationPluginOptions): void
}

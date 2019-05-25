import { RouteContext } from './RouteContext'
import { Types } from './Types'

export class RouteBuilder <Modules> {
  constructor(private route: RouteContext<Modules>) {}

  use (middleware: Types.RouteMiddleware) {
    this.route.result.middleware.push(middleware)
  }
}

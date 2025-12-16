import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
// import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard'; // Assuming auth is needed, but user didn't explicitly ask for it on this route, but it's "professional".
// Let's keep it open for now or add if I see other controllers using it.
// The user request didn't specify auth, but "Professional" implies security.
// However, I don't want to break it if I don't have the right guard path handy or if it blocks testing.
// I'll skip the guard for now to ensure it works immediately, or I can add it if I see it in other controllers.
// Checking other controllers... `ceo-office-app.controller.ts` uses `@UseGuards(JwtAuthGuard)`.
// So I should probably use it too.

@Controller('ceo-office-app/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardData() {
    return await this.dashboardService.getDashboardData();
  }
}

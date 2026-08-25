package com.swiftride.dto.response;

public class AdminDashboardStatsDto {

    private Long totalUsers;
    private Long totalRiders;
    private Long totalDrivers;
    private Long totalApprovedDrivers;
    private Long activeDrivers;
    private Long onlineDrivers;
    private Long busyDrivers;
    private Long pendingDriverApprovals;
    private Long activeRides;
    private Long activeTrips;
    private Long completedRides;
    private Long completedTrips;
    private Long cancelledRides;
    private Double grossRevenue;
    private Double driverEarnings;
    private Double platformCommission;
    private Double totalRevenue;
    private Double totalRevenueEstimated;
    private Double averageRating;

    public AdminDashboardStatsDto() {}

    public AdminDashboardStatsDto(
            Long totalUsers,
            Long totalRiders,
            Long totalDrivers,
            Long totalApprovedDrivers,
            Long activeDrivers,
            Long onlineDrivers,
            Long busyDrivers,
            Long pendingDriverApprovals,
            Long activeRides,
            Long activeTrips,
            Long completedRides,
            Long completedTrips,
            Long cancelledRides,
            Double grossRevenue,
            Double driverEarnings,
            Double platformCommission,
            Double totalRevenue,
            Double totalRevenueEstimated,
            Double averageRating
    ) {
        this.totalUsers = totalUsers;
        this.totalRiders = totalRiders;
        this.totalDrivers = totalDrivers;
        this.totalApprovedDrivers = totalApprovedDrivers;
        this.activeDrivers = activeDrivers;
        this.onlineDrivers = onlineDrivers;
        this.busyDrivers = busyDrivers;
        this.pendingDriverApprovals = pendingDriverApprovals;
        this.activeRides = activeRides;
        this.activeTrips = activeTrips;
        this.completedRides = completedRides;
        this.completedTrips = completedTrips;
        this.cancelledRides = cancelledRides;
        this.grossRevenue = grossRevenue;
        this.driverEarnings = driverEarnings;
        this.platformCommission = platformCommission;
        this.totalRevenue = totalRevenue;
        this.totalRevenueEstimated = totalRevenueEstimated;
        this.averageRating = averageRating;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long totalUsers;
        private Long totalRiders;
        private Long totalDrivers;
        private Long totalApprovedDrivers;
        private Long activeDrivers;
        private Long onlineDrivers;
        private Long busyDrivers;
        private Long pendingDriverApprovals;
        private Long activeRides;
        private Long activeTrips;
        private Long completedRides;
        private Long completedTrips;
        private Long cancelledRides;
        private Double grossRevenue;
        private Double driverEarnings;
        private Double platformCommission;
        private Double totalRevenue;
        private Double totalRevenueEstimated;
        private Double averageRating;

        public Builder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder totalRiders(Long totalRiders) { this.totalRiders = totalRiders; return this; }
        public Builder totalDrivers(Long totalDrivers) { this.totalDrivers = totalDrivers; return this; }
        public Builder totalApprovedDrivers(Long totalApprovedDrivers) { this.totalApprovedDrivers = totalApprovedDrivers; return this; }
        public Builder activeDrivers(Long activeDrivers) { this.activeDrivers = activeDrivers; return this; }
        public Builder onlineDrivers(Long onlineDrivers) { this.onlineDrivers = onlineDrivers; return this; }
        public Builder busyDrivers(Long busyDrivers) { this.busyDrivers = busyDrivers; return this; }
        public Builder pendingDriverApprovals(Long val) { this.pendingDriverApprovals = val; return this; }
        public Builder activeRides(Long activeRides) { this.activeRides = activeRides; this.activeTrips = activeRides; return this; }
        public Builder activeTrips(Long activeTrips) { this.activeTrips = activeTrips; this.activeRides = activeTrips; return this; }
        public Builder completedRides(Long completedRides) { this.completedRides = completedRides; this.completedTrips = completedRides; return this; }
        public Builder completedTrips(Long completedTrips) { this.completedTrips = completedTrips; this.completedRides = completedTrips; return this; }
        public Builder cancelledRides(Long cancelledRides) { this.cancelledRides = cancelledRides; return this; }
        public Builder grossRevenue(Double grossRevenue) { this.grossRevenue = grossRevenue; this.totalRevenue = grossRevenue; this.totalRevenueEstimated = grossRevenue; return this; }
        public Builder driverEarnings(Double driverEarnings) { this.driverEarnings = driverEarnings; return this; }
        public Builder platformCommission(Double platformCommission) { this.platformCommission = platformCommission; return this; }
        public Builder totalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; this.grossRevenue = totalRevenue; this.totalRevenueEstimated = totalRevenue; return this; }
        public Builder totalRevenueEstimated(Double rev) { this.totalRevenueEstimated = rev; this.grossRevenue = rev; this.totalRevenue = rev; return this; }
        public Builder averageRating(Double rating) { this.averageRating = rating; return this; }

        public AdminDashboardStatsDto build() {
            return new AdminDashboardStatsDto(
                    totalUsers, totalRiders, totalDrivers, totalApprovedDrivers,
                    activeDrivers, onlineDrivers, busyDrivers, pendingDriverApprovals,
                    activeRides, activeTrips, completedRides, completedTrips, cancelledRides,
                    grossRevenue, driverEarnings, platformCommission, totalRevenue,
                    totalRevenueEstimated, averageRating
            );
        }
    }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalRiders() { return totalRiders; }
    public void setTotalRiders(Long totalRiders) { this.totalRiders = totalRiders; }

    public Long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(Long totalDrivers) { this.totalDrivers = totalDrivers; }

    public Long getTotalApprovedDrivers() { return totalApprovedDrivers; }
    public void setTotalApprovedDrivers(Long totalApprovedDrivers) { this.totalApprovedDrivers = totalApprovedDrivers; }

    public Long getActiveDrivers() { return activeDrivers; }
    public void setActiveDrivers(Long activeDrivers) { this.activeDrivers = activeDrivers; }

    public Long getOnlineDrivers() { return onlineDrivers; }
    public void setOnlineDrivers(Long onlineDrivers) { this.onlineDrivers = onlineDrivers; }

    public Long getBusyDrivers() { return busyDrivers; }
    public void setBusyDrivers(Long busyDrivers) { this.busyDrivers = busyDrivers; }

    public Long getPendingDriverApprovals() { return pendingDriverApprovals; }
    public void setPendingDriverApprovals(Long pendingDriverApprovals) { this.pendingDriverApprovals = pendingDriverApprovals; }

    public Long getActiveRides() { return activeRides; }
    public void setActiveRides(Long activeRides) { this.activeRides = activeRides; }

    public Long getActiveTrips() { return activeTrips; }
    public void setActiveTrips(Long activeTrips) { this.activeTrips = activeTrips; }

    public Long getCompletedRides() { return completedRides; }
    public void setCompletedRides(Long completedRides) { this.completedRides = completedRides; }

    public Long getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(Long completedTrips) { this.completedTrips = completedTrips; }

    public Long getCancelledRides() { return cancelledRides; }
    public void setCancelledRides(Long cancelledRides) { this.cancelledRides = cancelledRides; }

    public Double getGrossRevenue() { return grossRevenue; }
    public void setGrossRevenue(Double grossRevenue) { this.grossRevenue = grossRevenue; }

    public Double getDriverEarnings() { return driverEarnings; }
    public void setDriverEarnings(Double driverEarnings) { this.driverEarnings = driverEarnings; }

    public Double getPlatformCommission() { return platformCommission; }
    public void setPlatformCommission(Double platformCommission) { this.platformCommission = platformCommission; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Double getTotalRevenueEstimated() { return totalRevenueEstimated; }
    public void setTotalRevenueEstimated(Double totalRevenueEstimated) { this.totalRevenueEstimated = totalRevenueEstimated; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
}

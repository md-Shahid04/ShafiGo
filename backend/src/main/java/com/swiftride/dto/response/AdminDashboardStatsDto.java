package com.swiftride.dto.response;

public class AdminDashboardStatsDto {

    private Long totalUsers;
    private Long totalRiders;
    private Long totalDrivers;
    private Long onlineDrivers;
    private Long busyDrivers;
    private Long pendingDriverApprovals;
    private Long activeRides;
    private Long completedRides;
    private Long cancelledRides;
    private Double totalRevenueEstimated;
    private Double averageRating;

    public AdminDashboardStatsDto() {}

    public AdminDashboardStatsDto(Long totalUsers, Long totalRiders, Long totalDrivers, Long onlineDrivers, Long busyDrivers, Long pendingDriverApprovals, Long activeRides, Long completedRides, Long cancelledRides, Double totalRevenueEstimated, Double averageRating) {
        this.totalUsers = totalUsers;
        this.totalRiders = totalRiders;
        this.totalDrivers = totalDrivers;
        this.onlineDrivers = onlineDrivers;
        this.busyDrivers = busyDrivers;
        this.pendingDriverApprovals = pendingDriverApprovals;
        this.activeRides = activeRides;
        this.completedRides = completedRides;
        this.cancelledRides = cancelledRides;
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
        private Long onlineDrivers;
        private Long busyDrivers;
        private Long pendingDriverApprovals;
        private Long activeRides;
        private Long completedRides;
        private Long cancelledRides;
        private Double totalRevenueEstimated;
        private Double averageRating;

        public Builder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder totalRiders(Long totalRiders) { this.totalRiders = totalRiders; return this; }
        public Builder totalDrivers(Long totalDrivers) { this.totalDrivers = totalDrivers; return this; }
        public Builder onlineDrivers(Long onlineDrivers) { this.onlineDrivers = onlineDrivers; return this; }
        public Builder busyDrivers(Long busyDrivers) { this.busyDrivers = busyDrivers; return this; }
        public Builder pendingDriverApprovals(Long val) { this.pendingDriverApprovals = val; return this; }
        public Builder activeRides(Long activeRides) { this.activeRides = activeRides; return this; }
        public Builder completedRides(Long completedRides) { this.completedRides = completedRides; return this; }
        public Builder cancelledRides(Long cancelledRides) { this.cancelledRides = cancelledRides; return this; }
        public Builder totalRevenueEstimated(Double rev) { this.totalRevenueEstimated = rev; return this; }
        public Builder averageRating(Double rating) { this.averageRating = rating; return this; }

        public AdminDashboardStatsDto build() {
            return new AdminDashboardStatsDto(totalUsers, totalRiders, totalDrivers, onlineDrivers, busyDrivers, pendingDriverApprovals, activeRides, completedRides, cancelledRides, totalRevenueEstimated, averageRating);
        }
    }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalRiders() { return totalRiders; }
    public void setTotalRiders(Long totalRiders) { this.totalRiders = totalRiders; }

    public Long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(Long totalDrivers) { this.totalDrivers = totalDrivers; }

    public Long getOnlineDrivers() { return onlineDrivers; }
    public void setOnlineDrivers(Long onlineDrivers) { this.onlineDrivers = onlineDrivers; }

    public Long getBusyDrivers() { return busyDrivers; }
    public void setBusyDrivers(Long busyDrivers) { this.busyDrivers = busyDrivers; }

    public Long getPendingDriverApprovals() { return pendingDriverApprovals; }
    public void setPendingDriverApprovals(Long pendingDriverApprovals) { this.pendingDriverApprovals = pendingDriverApprovals; }

    public Long getActiveRides() { return activeRides; }
    public void setActiveRides(Long activeRides) { this.activeRides = activeRides; }

    public Long getCompletedRides() { return completedRides; }
    public void setCompletedRides(Long completedRides) { this.completedRides = completedRides; }

    public Long getCancelledRides() { return cancelledRides; }
    public void setCancelledRides(Long cancelledRides) { this.cancelledRides = cancelledRides; }

    public Double getTotalRevenueEstimated() { return totalRevenueEstimated; }
    public void setTotalRevenueEstimated(Double totalRevenueEstimated) { this.totalRevenueEstimated = totalRevenueEstimated; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
}

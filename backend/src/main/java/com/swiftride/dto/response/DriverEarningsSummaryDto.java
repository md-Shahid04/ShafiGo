package com.swiftride.dto.response;

public class DriverEarningsSummaryDto {

    private Double todayEarnings;
    private Double weeklyEarnings;
    private Double monthlyEarnings;
    private Double totalEarnings;
    private Long completedTrips;
    private Long todayTrips;
    private String onlineHours;
    private Double averageEarningsPerTrip;

    public DriverEarningsSummaryDto() {}

    public DriverEarningsSummaryDto(Double todayEarnings, Double weeklyEarnings, Double monthlyEarnings, Double totalEarnings, Long completedTrips, Long todayTrips, String onlineHours, Double averageEarningsPerTrip) {
        this.todayEarnings = todayEarnings;
        this.weeklyEarnings = weeklyEarnings;
        this.monthlyEarnings = monthlyEarnings;
        this.totalEarnings = totalEarnings;
        this.completedTrips = completedTrips;
        this.todayTrips = todayTrips;
        this.onlineHours = onlineHours;
        this.averageEarningsPerTrip = averageEarningsPerTrip;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double todayEarnings = 0.0;
        private Double weeklyEarnings = 0.0;
        private Double monthlyEarnings = 0.0;
        private Double totalEarnings = 0.0;
        private Long completedTrips = 0L;
        private Long todayTrips = 0L;
        private String onlineHours = "0h 0m";
        private Double averageEarningsPerTrip = 0.0;

        public Builder todayEarnings(Double val) { this.todayEarnings = val; return this; }
        public Builder weeklyEarnings(Double val) { this.weeklyEarnings = val; return this; }
        public Builder monthlyEarnings(Double val) { this.monthlyEarnings = val; return this; }
        public Builder totalEarnings(Double val) { this.totalEarnings = val; return this; }
        public Builder completedTrips(Long val) { this.completedTrips = val; return this; }
        public Builder todayTrips(Long val) { this.todayTrips = val; return this; }
        public Builder onlineHours(String val) { this.onlineHours = val; return this; }
        public Builder averageEarningsPerTrip(Double val) { this.averageEarningsPerTrip = val; return this; }

        public DriverEarningsSummaryDto build() {
            return new DriverEarningsSummaryDto(todayEarnings, weeklyEarnings, monthlyEarnings, totalEarnings, completedTrips, todayTrips, onlineHours, averageEarningsPerTrip);
        }
    }

    public Double getTodayEarnings() { return todayEarnings; }
    public void setTodayEarnings(Double todayEarnings) { this.todayEarnings = todayEarnings; }

    public Double getWeeklyEarnings() { return weeklyEarnings; }
    public void setWeeklyEarnings(Double weeklyEarnings) { this.weeklyEarnings = weeklyEarnings; }

    public Double getMonthlyEarnings() { return monthlyEarnings; }
    public void setMonthlyEarnings(Double monthlyEarnings) { this.monthlyEarnings = monthlyEarnings; }

    public Double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; }

    public Long getCompletedTrips() { return completedTrips; }
    public void setCompletedTrips(Long completedTrips) { this.completedTrips = completedTrips; }

    public Long getTodayTrips() { return todayTrips; }
    public void setTodayTrips(Long todayTrips) { this.todayTrips = todayTrips; }

    public String getOnlineHours() { return onlineHours; }
    public void setOnlineHours(String onlineHours) { this.onlineHours = onlineHours; }

    public Double getAverageEarningsPerTrip() { return averageEarningsPerTrip; }
    public void setAverageEarningsPerTrip(Double averageEarningsPerTrip) { this.averageEarningsPerTrip = averageEarningsPerTrip; }
}

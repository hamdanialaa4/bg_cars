import { ref } from 'vue';

// AI Service for car recommendations and market analysis
export const useAI = () => {
  const isLoading = ref(false);

  // Smart car recommendations based on user preferences
  const getCarRecommendations = async (userPreferences, availableCars) => {
    isLoading.value = true;
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const recommendations = availableCars
        .filter(car => {
          // AI filtering logic based on preferences
          const matchesPrice = !userPreferences.maxPrice ||
            car.price <= userPreferences.maxPrice;
          const matchesMake = !userPreferences.preferredMakes?.length ||
            userPreferences.preferredMakes.includes(car.make);
          const matchesFuel = !userPreferences.fuelType ||
            car.fuelType === userPreferences.fuelType;

          return matchesPrice && matchesMake && matchesFuel;
        })
        .sort((a, b) => {
          // AI scoring algorithm
          const scoreA = calculateAIScore(a, userPreferences);
          const scoreB = calculateAIScore(b, userPreferences);
          return scoreB - scoreA;
        })
        .slice(0, 6); // Return top 6 recommendations

      return recommendations;
    } finally {
      isLoading.value = false;
    }
  };

  // Market trend analysis
  const analyzeMarketTrends = async (cars) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const trends = {
        averagePrice: cars.reduce((sum, car) => sum + car.price, 0) / cars.length,
        popularMakes: getPopularMakes(cars),
        priceRanges: getPriceRanges(cars),
        fuelTypeDistribution: getFuelTypeDistribution(cars)
      };

      return trends;
    } finally {
      isLoading.value = false;
    }
  };

  // Smart search with AI assistance
  const smartSearch = async (query, filters) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // AI-powered search logic
      const results = {
        exactMatches: [],
        similarMatches: [],
        aiSuggestions: []
      };

      // Implement AI search logic here
      return results;
    } finally {
      isLoading.value = false;
    }
  };

  // Helper functions
  const calculateAIScore = (car, preferences) => {
    let score = 0;

    // Price match scoring
    if (preferences.budget) {
      const priceDiff = Math.abs(car.price - preferences.budget);
      score += Math.max(0, 100 - (priceDiff / preferences.budget) * 100);
    }

    // Year preference
    if (preferences.preferredYear) {
      const yearDiff = Math.abs(car.year - preferences.preferredYear);
      score += Math.max(0, 50 - yearDiff * 2);
    }

    // Mileage scoring (lower mileage = higher score)
    if (car.mileage) {
      score += Math.max(0, 100 - (car.mileage / 200000) * 100);
    }

    return score;
  };

  const getPopularMakes = (cars) => {
    const makeCount = {};
    cars.forEach(car => {
      makeCount[car.make] = (makeCount[car.make] || 0) + 1;
    });

    return Object.entries(makeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([make, count]) => ({ make, count }));
  };

  const getPriceRanges = (cars) => {
    const ranges = {
      '0-10000': 0,
      '10000-25000': 0,
      '25000-50000': 0,
      '50000+': 0
    };

    cars.forEach(car => {
      if (car.price < 10000) ranges['0-10000']++;
      else if (car.price < 25000) ranges['10000-25000']++;
      else if (car.price < 50000) ranges['25000-50000']++;
      else ranges['50000+']++;
    });

    return ranges;
  };

  const getFuelTypeDistribution = (cars) => {
    const distribution = {};
    cars.forEach(car => {
      distribution[car.fuelType] = (distribution[car.fuelType] || 0) + 1;
    });
    return distribution;
  };

  return {
    isLoading,
    getCarRecommendations,
    analyzeMarketTrends,
    smartSearch
  };
};

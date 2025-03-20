export class MathManager {
  private static instance: MathManager;

  private constructor() {}

  static getInstance(): MathManager {
    if (!MathManager.instance) {
      MathManager.instance = new MathManager();
    }
    return MathManager.instance;
  }

  calculateTotalCalories(nutrients: {
    proteins: number;
    carbohydrates: number;
    fat: number;
  }): number {
    return (
      nutrients.proteins * 4 +
      nutrients.carbohydrates * 4 +
      nutrients.fat * 9
    );
  }

  calculateDailyNeeds(weight: number, height: number, age: number, activityLevel: ActivityLevel, gender: Gender): number {
    const bmr = this.calculateBMR(weight, height, age, gender);
    return this.calculateTotalWithActivity(bmr, activityLevel);
  }

  private calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? base + 5 : base - 161;
  }

  private calculateTotalWithActivity(bmr: number, level: ActivityLevel): number {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    return bmr * multipliers[level];
  }

  calculateMacroRatio(goalType: GoalType): MacroRatio {
    switch (goalType) {
      case GoalType.WeightLoss:
        return { protein: 0.4, carbs: 0.35, fat: 0.25 };
      case GoalType.Maintenance:
        return { protein: 0.3, carbs: 0.4, fat: 0.3 };
      case GoalType.MuscleGain:
        return { protein: 0.3, carbs: 0.5, fat: 0.2 };
      default:
        return { protein: 0.33, carbs: 0.33, fat: 0.33 };
    }
  }
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Gender = 'male' | 'female';

export enum GoalType {
  WeightLoss = 'WEIGHT_LOSS',
  Maintenance = 'MAINTENANCE',
  MuscleGain = 'MUSCLE_GAIN',
}

export interface MacroRatio {
  protein: number;
  carbs: number;
  fat: number;
} 
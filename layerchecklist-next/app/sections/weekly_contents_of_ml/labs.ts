import type { ComponentType } from "react";
import { SplitLab, PreprocessingLab, EncodingLab } from "./week0/Labs";
import { BoundaryLab, FoldLab, ThresholdLab } from "./week1/Labs";
import { PolynomialFitLab, CyclicFeatureLab, AblationLab } from "./week2/Labs";
import { GradientStepLab, DiagnoseLab, EarlyStopLab } from "./week3/Labs";
import { ShapeLab, LossMismatchLab, RestoreWeightsLab } from "./week4/Labs";

const mlLabs: Record<number, Record<string, ComponentType>> = {
  0: { "split-before-fitting": SplitLab, "missing-and-invalid": PreprocessingLab, "numeric-and-categorical": EncodingLab },
  1: { "model-families": BoundaryLab, "evaluate-fairly": FoldLab, "read-the-metrics": ThresholdLab },
  2: { "representation": PolynomialFitLab, "domain-transformations": CyclicFeatureLab, "ablation": AblationLab },
  3: { "objective-and-updates": GradientStepLab, "diagnose-first": DiagnoseLab, "final-evaluation": EarlyStopLab },
  4: { "tensors-and-layers": ShapeLab, "output-and-loss": LossMismatchLab, "early-stopping": RestoreWeightsLab },
};

export function getMLLabs(week: number): Record<string, ComponentType> {
  return mlLabs[week] ?? {};
}

from preprocessing import load_data
from split_data import split_data

from train_model import train_model
from predict import load_model

from threshold_selection import find_best_threshold

from shap_explain import explain_prediction

from evaluate import (
    evaluate_model,
    cross_validate_model
)

from model_comparison import compare_models
from model_factory import create_models

from probability_analysis import (
    get_probability_predictions
)

from calibration import (
    create_calibrated_models
)

from threshold_optimization import (
    evaluate_thresholds
)

from final_threshold_evaluation import (
    evaluate_with_threshold
)

# =========================================================
# STEP 1: Load raw dataset
# =========================================================

df = load_data()


# =========================================================
# STEP 2: Split dataset
# =========================================================

X_train, X_test, y_train, y_test = split_data(df)


print("\n----- Dataset Split -----")

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# =========================================================
# STEP 3: Model Comparison
# =========================================================

comparison_results = compare_models(
    X_train,
    y_train
)

print("\n----- Model Comparison -----")

for model_name, metrics in comparison_results.items():

    print(f"\n{model_name}")

    print(
        "Accuracy:",
        metrics["accuracy"]
    )

    print(
        "Precision:",
        metrics["precision"]
    )

    print(
        "Recall:",
        metrics["recall"]
    )

    print(
        "F1 Score:",
        metrics["f1"]
    )

    print(
        "ROC-AUC:",
        metrics["roc_auc"]
    )


# =========================================================
# STEP 4: Cross Validation
# =========================================================

cv_results = cross_validate_model(
    X_train,
    y_train
)

print("\n----- Cross-Validation Results -----")

print(
    "CV Accuracy:",
    cv_results["accuracy"]
)

print(
    "CV Precision:",
    cv_results["precision"]
)

print(
    "CV Recall:",
    cv_results["recall"]
)

print(
    "CV F1 Score:",
    cv_results["f1_score"]
)

print(
    "CV ROC-AUC:",
    cv_results["roc_auc"]
)


# =========================================================
# STEP 5: Train Final Logistic Regression Pipeline
# =========================================================

model = train_model(
    X_train,
    y_train
)


# =========================================================
# STEP 6: Load Saved Model
# =========================================================

loaded_model = load_model()


# =========================================================
# STEP 7: Final Test Evaluation
# =========================================================

evaluation_results = evaluate_model(
    loaded_model,
    X_test,
    y_test
)

print("\n----- Final Test Evaluation -----")

print(
    "Accuracy:",
    evaluation_results["accuracy"]
)

print(
    "Precision:",
    evaluation_results["precision"]
)

print(
    "Recall:",
    evaluation_results["recall"]
)

print(
    "F1 Score:",
    evaluation_results["f1_score"]
)

print(
    "ROC-AUC:",
    evaluation_results["roc_auc"]
)

print("\nConfusion Matrix:")

print(
    evaluation_results["confusion_matrix"]
)


# =========================================================
# STEP 8: Probability Analysis
# =========================================================

models = create_models()

probabilities = get_probability_predictions(
    models,
    X_train,
    y_train,
    X_test
)

print("\n----- Probability Analysis -----")

for model_name, model_probabilities in probabilities.items():

    print(f"\n{model_name}")

    print(
        "First 10 probabilities:"
    )

    print(
        model_probabilities[:10]
    )


# =========================================================
# STEP 9: Probability Calibration
# =========================================================

calibrated_models = create_calibrated_models()

print("\n----- Calibration Models Created -----")

for model_name in calibrated_models:

    print(
        model_name,
        "→ Sigmoid calibrated"
    )


print("\n----- Calibrated Probabilities -----")

for model_name, calibrated_model in calibrated_models.items():

    calibrated_model.fit(
        X_train,
        y_train
    )

    calibrated_probabilities = (
        calibrated_model.predict_proba(X_test)[:, 1]
    )

    print(f"\n{model_name}")

    print(
        "First 10 calibrated probabilities:"
    )

    print(
        calibrated_probabilities[:10]
    )


# =========================================================
# STEP 10: Threshold Analysis
# =========================================================

threshold_results = evaluate_thresholds(
    loaded_model,
    X_test,
    y_test
)

print("\n----- Threshold Optimization -----")

for result in threshold_results:

    print(
        f"Threshold: {result['threshold']:.2f} | "
        f"Precision: {result['precision']:.3f} | "
        f"Recall: {result['recall']:.3f} | "
        f"F1: {result['f1']:.3f} | "
        f"FP: {result['false_positives']} | "
        f"FN: {result['false_negatives']}"
    )


    # =========================================================
# STEP 11: Validation-Based Threshold Selection
# =========================================================

best_threshold, threshold_validation_results = (
    find_best_threshold(
        X_train,
        y_train
    )
)

print("\n----- Validation-Based Threshold Selection -----")

print(
    "Best Threshold:",
    round(best_threshold["threshold"], 2)
)

print(
    "Validation Precision:",
    round(best_threshold["precision"], 3)
)

print(
    "Validation Recall:",
    round(best_threshold["recall"], 3)
)

print(
    "Validation F1:",
    round(best_threshold["f1"], 3)
)

# =========================================================
# STEP 12: Final Test Evaluation With Selected Threshold
# =========================================================

final_threshold = best_threshold["threshold"]

final_threshold_results = evaluate_with_threshold(
    loaded_model,
    X_test,
    y_test,
    final_threshold
)

print("\n----- Final Evaluation With Selected Threshold -----")

print(
    "Selected Threshold:",
    final_threshold_results["threshold"]
)

print(
    "Accuracy:",
    final_threshold_results["accuracy"]
)

print(
    "Precision:",
    final_threshold_results["precision"]
)

print(
    "Recall:",
    final_threshold_results["recall"]
)

print(
    "F1 Score:",
    final_threshold_results["f1"]
)

print("\nConfusion Matrix:")

print(
    final_threshold_results["confusion_matrix"]
)


# STEP 13
sample = X_test.iloc[[0]]

shap_results = explain_prediction(
    loaded_model,
    X_train,
    sample
)

print("\n----- SHAP Explanation -----")

print(
    shap_results[
        [
            "feature",
            "shap_value"
        ]
    ].head(10)
)
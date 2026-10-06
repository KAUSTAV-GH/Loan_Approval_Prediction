import numpy as np

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)


def evaluate_thresholds(model, X_test, y_test):

    probabilities = model.predict_proba(X_test)[:, 1]

    thresholds = np.arange(
        0.30,
        0.81,
        0.05
    )

    results = []

    for threshold in thresholds:

        predictions = (
            probabilities >= threshold
        ).astype(int)

        precision = precision_score(
            y_test,
            predictions,
            zero_division=0
        )

        recall = recall_score(
            y_test,
            predictions,
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            predictions,
            zero_division=0
        )

        matrix = confusion_matrix(
            y_test,
            predictions
        )

        tn, fp, fn, tp = matrix.ravel()

        results.append({
            "threshold": threshold,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "true_negatives": tn,
            "false_positives": fp,
            "false_negatives": fn,
            "true_positives": tp
        })

    return results
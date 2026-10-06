import numpy as np

from sklearn.base import clone
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import precision_score, recall_score, f1_score

from train_model import create_model


def find_best_threshold(X_train, y_train):

    model = create_model()

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42
    )

    probabilities = cross_val_predict(
        model,
        X_train,
        y_train,
        cv=cv,
        method="predict_proba"
    )[:, 1]

    thresholds = np.arange(
        0.30,
        0.81,
        0.01
    )

    results = []

    for threshold in thresholds:

        predictions = (
            probabilities >= threshold
        ).astype(int)

        precision = precision_score(
            y_train,
            predictions,
            zero_division=0
        )

        recall = recall_score(
            y_train,
            predictions,
            zero_division=0
        )

        f1 = f1_score(
            y_train,
            predictions,
            zero_division=0
        )

        results.append({
            "threshold": threshold,
            "precision": precision,
            "recall": recall,
            "f1": f1
        })

    best_result = max(
        results,
        key=lambda x: x["f1"]
    )

    return best_result, results
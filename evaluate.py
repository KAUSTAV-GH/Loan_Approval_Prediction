from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

from sklearn.model_selection import (
    StratifiedKFold,
    cross_validate
)

from train_model import create_model


def cross_validate_model(X_train, y_train):

    model = create_model()

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42
    )

    scoring = {
        "accuracy": "accuracy",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "roc_auc": "roc_auc"
    }

    results = cross_validate(
        model,
        X_train,
        y_train,
        cv=cv,
        scoring=scoring
    )

    return {
        "accuracy": results["test_accuracy"].mean(),
        "precision": results["test_precision"].mean(),
        "recall": results["test_recall"].mean(),
        "f1_score": results["test_f1"].mean(),
        "roc_auc": results["test_roc_auc"].mean()
    }


def evaluate_model(model, X_test, y_test):

    predictions = model.predict(X_test)

    probabilities = model.predict_proba(X_test)[:, 1]

    return {
        "accuracy": accuracy_score(
            y_test,
            predictions
        ),

        "precision": precision_score(
            y_test,
            predictions,
            zero_division=0
        ),

        "recall": recall_score(
            y_test,
            predictions,
            zero_division=0
        ),

        "f1_score": f1_score(
            y_test,
            predictions,
            zero_division=0
        ),

        "roc_auc": roc_auc_score(
            y_test,
            probabilities
        ),

        "confusion_matrix": confusion_matrix(
            y_test,
            predictions
        )
    }
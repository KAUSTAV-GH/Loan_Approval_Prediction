from sklearn.model_selection import StratifiedKFold, cross_validate

from model_factory import create_models


def compare_models(X_train, y_train):

    models = create_models()

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

    results = {}

    for name, model in models.items():

        cv_results = cross_validate(
            model,
            X_train,
            y_train,
            cv=cv,
            scoring=scoring
        )

        results[name] = {
            "accuracy": cv_results["test_accuracy"].mean(),
            "precision": cv_results["test_precision"].mean(),
            "recall": cv_results["test_recall"].mean(),
            "f1": cv_results["test_f1"].mean(),
            "roc_auc": cv_results["test_roc_auc"].mean()
        }

    return results
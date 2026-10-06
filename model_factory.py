from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

from preprocessing import create_preprocessor


def create_models():

    models = {

        "Logistic Regression": Pipeline([
            ("preprocessor", create_preprocessor()),
            ("classifier", LogisticRegression(max_iter=2000))
        ]),

        "Random Forest": Pipeline([
            ("preprocessor", create_preprocessor()),
            ("classifier", RandomForestClassifier(
                n_estimators=200,
                random_state=42
            ))
        ]),

        "Gradient Boosting": Pipeline([
            ("preprocessor", create_preprocessor()),
            ("classifier", GradientBoostingClassifier(
                random_state=42
            ))
        ])
    }

    return models
import joblib

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

from preprocessing import create_preprocessor


def create_model():

    model = Pipeline([
        ("preprocessor", create_preprocessor()),
        ("classifier", LogisticRegression(max_iter=2000))
    ])

    return model


def train_model(X_train, y_train):

    model = create_model()

    model.fit(X_train, y_train)

    joblib.dump(
        model,
        "models/loan_model.pkl"
    )

    print("Model trained and saved successfully!")

    return model
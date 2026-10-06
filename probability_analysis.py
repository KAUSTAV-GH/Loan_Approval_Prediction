from model_factory import create_models


def get_probability_predictions(
    models,
    X_train,
    y_train,
    X_test
):

    probabilities = {}

    for name, model in models.items():

        model.fit(X_train, y_train)

        probabilities[name] = (
            model.predict_proba(X_test)[:, 1]
        )

    return probabilities
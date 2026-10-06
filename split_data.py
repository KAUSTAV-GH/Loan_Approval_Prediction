from sklearn.model_selection import train_test_split


def split_data(df):

    X = df.drop("Loan_Status", axis=1)

    y = df["Loan_Status"].map({
        "Y": 1,
        "N": 0
    })

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    return X_train, X_test, y_train, y_test
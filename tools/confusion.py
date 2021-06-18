# @author Loreto Parisi loretoparisi@gmail.com
# @2017-2019 Loreto Parisi loretoparisi@gmail.com

import argparse
import numpy as np
import itertools
from sklearn.metrics import confusion_matrix
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import matplotlib.pyplot as plt

def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

        
    print('Confusion matrix')

    print(cm)

    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    fmt = '.2f' if normalize else 'd'
    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, format(cm[i, j], fmt),
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')

def parse_labels(path):
    test_labels = []
    with open(path,'rb') as f:
        for line in f:
            test_labels.append( line.decode('utf-8').split(' ')[0][10:].split('\n')[0])
        return np.array([x for x in test_labels if x])


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Display confusion matrix.')
    parser.add_argument('test', help='Path to test labels')
    parser.add_argument('predict', help='Path to predictions')
    parser.add_argument('plot', help='plot the confusion matrix')
    args = parser.parse_args()

    max_labels = 300
    
    # test labels
    test_labels = parse_labels(args.test)
    test_labels = test_labels[0:max_labels]

    print("Test labels:%d (sample)%s" % (len(test_labels),test_labels[:1]) )
    
    # predictions
    pred_labels = parse_labels(args.predict)
    pred_labels = np.nan_to_num( pred_labels)
    pred_labels = pred_labels[0:max_labels]
    
    print("Predicted labels:%d (sample)%s" % (len(pred_labels),pred_labels[:1]) )

    eq = test_labels == pred_labels
    print("Accuracy: " + str(eq.sum() / len(test_labels)))

    print("test_labels:%s" % test_labels)
    print("pred_labels:%s" % pred_labels)

    # confusion matrix
    cnf_matrix =  confusion_matrix(test_labels, pred_labels)
    print("Confusion Matrix:")
    print(cnf_matrix)

    if args.plot in ['true', '1']:

        values = list(test_labels)

        label_encoder = LabelEncoder()
        integer_encoded = label_encoder.fit_transform(values)
        integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
        
        label_index=label_encoder.transform(values)
        label_dict = dict(zip(values, label_index))

        sorted_labels_int = sorted(label_dict, key=label_dict.get, reverse=False)

        print("sorted_labels_int:%s" % sorted_labels_int)
        
        plt.figure()
        plot_confusion_matrix(cnf_matrix, classes=sorted_labels_int, normalize=True, title='Confusion matrix')
        plt.show()

    else:
        cnf_matrix_norm = cnf_matrix.astype('float') / cnf_matrix.sum(axis=1)[:, np.newaxis]
        print("Normalized:")
        print(cnf_matrix_norm)


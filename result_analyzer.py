from pprint import pprint as pp
import json
import os
import pandas as pd
import sys
sys.dont_write_bytecode = True
# change these as per total number of questions in questions and answers database
TOTAL_NUM_OF_QUESTIONS = 140
series_of_actual_qnum = pd.Series(range(1,TOTAL_NUM_OF_QUESTIONS+1))
final_df = pd.DataFrame()
list_of_df = []

res_json_files = [pos_json for pos_json in os.listdir(
    os.getcwd()) if pos_json.endswith('.json')]

for res_file in res_json_files:
    with open(res_file) as json_file:
        json_text = json.load(json_file)
        for item in json_text['results']:
            item_dict = {"qNumber": [item['qNumber']], 'isCorrect': [item['isCorrect']]}
            # read data frame from json file
            df = pd.DataFrame.from_dict(item_dict)
            list_of_df.append(df)  # append the data frame to the list
# concatenate all the data frames in the list.
final_df = pd.concat(list_of_df, ignore_index=True)

def unique_ques(df):
    temp_df = df.drop_duplicates(subset='qNumber')
    temp_df = temp_df.reset_index(drop=True)
    return temp_df

def questions_not_attempted(df):
    uniq_q_num_series = df.qNumber
    res = series_of_actual_qnum[~series_of_actual_qnum.isin(uniq_q_num_series)]
    return res

uniq_ques_df = unique_ques(final_df)

# pp("Unique number of questions attempted so far: {}".format(uniq_ques_df.qNumber.size))
# pp("Number of questions not attempted so far: {}".format(questions_not_attempted(uniq_ques_df).size))

frequency = final_df['qNumber'].value_counts()
qnum_freq_df = pd.DataFrame(frequency)
qnum_freq_df.reset_index(level=0, inplace=True)
qnum_freq_df.columns = ['qNumber','frequency']
# pp(qnum_freq_df.sort_values('frequency',ascending=False).head(10))
# pp(qnum_freq_df.sort_values('frequency',ascending=False).tail(15))
# pp(qnum_freq_df[qnum_freq_df['frequency'] == 12])
# pp(final_df[final_df['qNumber'] == 81].head(20))
max_freq = max(qnum_freq_df['frequency'])
min_freq = min(qnum_freq_df['frequency'])
for i in range(min_freq,max_freq+1):
    print(i,"-times->",int(qnum_freq_df[qnum_freq_df['frequency'] == i].size / 2),'questions')
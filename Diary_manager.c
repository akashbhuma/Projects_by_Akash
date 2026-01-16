#include<stdio.h>
#include<stdlib.h>
#include<string.h>

typedef struct date{
  char date[11]; 
  char entry[1000];
} dt;

dt data[500];
int entrycount=0;
void loadEntry()
{ FILE *load;
    load = fopen("Diary_entry.txt", "r");
    if (!load)
    {printf("File not found or empty. Starting fresh.\n");
       return;
    }

    
    while (fscanf(load, "%10[^|]|%999[^\n]\n", data[entrycount].date, data[entrycount].entry) == 2)
    { entrycount++;
        if (entrycount == 500)
        {printf("Data is full. No more entries.\n");
            break;
        }
    }

    fclose(load);
}

void saveEntry()
{ FILE *save;
    save = fopen("Diary_entry.txt", "w");
    if (!save)
    {
        printf("Error saving diary entries.\n");
        return;
    }

    int i;
    for (i = 0; i < entrycount; i++)
    {
        fprintf(save, "%s|%s\n", data[i].date, data[i].entry);
    }

    fclose(save);
    printf("All entries saved successfully.\n");
}


void addEntry() // takes input from user and stor in string.
{if(entrycount==500)
{printf("Limit completed. Cannot add more entries");
return;
}
dt text;
printf("Enter the date in DD/MM/YYYY format: ");
scanf("%10s",text.date);
getchar();
printf("Entry your diary entry (Type DONE in a new line after the entry.): ");
text.entry[0]='\0';
char temp[1000];
while(1)
{fgets(temp,1000,stdin);
  temp[strcspn(temp,"\n")]='\0';
 if(strcmp(temp,"DONE")==0)
 {break;
 }

if(strlen(text.entry)+strlen(temp)+1<1000)
{strcat(text.entry,temp);
strcat(text.entry,"\n");
}
else if (strlen(text.entry)+strlen(temp)+1>=1000)
{printf("Limit exceeded.\n");
break;
}
}
data[entrycount++]=text;
printf("Entry added successfully to date:%s.\n",text.date);
}

void viewEntry() // print all entries in file.
{ if(entrycount==0)
{printf("No diary entries forund.\n");
return;
}
printf("Diary entries:\n");
int i;
for(i=0;i<entrycount;i++)
{printf("%s: %s\n",data[i].date,data[i].entry);
}
}

void searchEntry()
{char ipdate[11];
int bool=0;
printf("Enter the date in DD/MM/YYYY format: ");
scanf("%10s",ipdate);
int i;
for(i=0;i<entrycount;i++)
{if(strcmp(ipdate,data[i].date)==0)
{printf("Entry found.\n");
  printf("%s: %s",data[i].date,data[i].entry);
  bool=1;
  break;
  }
}
if(bool==0)
printf("Entry not found for the date:%s\n",ipdate);
}

void deleteEntry()
{char ipdate[10];
printf("Enter the date in DD/MM/YYYY format: ");
scanf("%10s",ipdate);
int i,j;
for(i=0;i<entrycount;i++)
{if(strcmp(ipdate,data[i].date)==0)
{for(j=i;j<entrycount-1;j++)
{data[j]=data[j+1];
}
entrycount--;
printf("Entry deleted successfully of date:%s\n",ipdate);
return;
}
}
}
  
int main()
{loadEntry();
   while (1) {
        int choice;
        printf("\nDiary Manager\n");
        printf("1. Add Entry\n");
        printf("2. View Entries\n");
        printf("3. Search Entries\n");
        printf("4. Delete Entries\n");
        printf("5. Save and Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                addEntry();
                break;
            case 2:
                viewEntry();
                break;
            case 3:
                searchEntry();
                break;
            case 4:
                deleteEntry();
                break;
            case 5:
                saveEntry();
                printf("Exiting Diary Manager. Goodbye!\n");
                return 0;
            default:
                printf("Invalid choice. Please try again.\n");
        }
    }
}
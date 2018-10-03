#include <stdio.h>
#include<stdlib.h>
void main()
{
	int n,sum=0,i;
	printf("enter no of elements");
	scanf("%d",n);
	int *par;
	par=(int *) malloc(sizeof(int) *n);


for(i=0;i<n;i++)
{
	printf("enter a number");
	scanf("%d",par+i);
}
for(i=0;i<n;i++)
{
	sum=sum+par[i];

}

}